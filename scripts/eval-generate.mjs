#!/usr/bin/env node
/**
 * eval-generate — hand an agent a brief and the design tree, keep what it built.
 *
 * This is the half `scripts/eval.mjs` could not do. The scorer measures a
 * candidate; until something produced one from a brief, the candidates were
 * hand-written and the loop measured the scorer rather than a model.
 *
 * WHAT IS UNDER TEST, and why this is not a context dump. The whole design of
 * DESIGN.md is one fetch per question: a short orienting file, then ONE leaf.
 * Pasting the entire tree into the prompt would measure "does a big dump work"
 * and prove nothing about that split. So the agent is given DESIGN.md and a
 * single tool, `read_design_file`, scoped to the design tree — and every path
 * it opens is recorded. The retrieval trace is the measurement that did not
 * exist before: which files an agent actually reaches for, in what order, and
 * how many it needs before it can build the page.
 *
 * The tool is also the isolation. It resolves nothing outside `DESIGN.md` and
 * `design/`, so the agent cannot fall back to `machine/*.yaml`, the source, or
 * the gallery. That restriction IS the experiment — it is the position of an
 * agent in someone else's editor with a URL and no checkout, which is the
 * reader DESIGN.md was built for and the one nothing has ever tested.
 *
 * WHY A MANUAL LOOP rather than the SDK's tool runner. The trace is the point,
 * and owning the loop keeps recording it trivial and adds no dependency beyond
 * the SDK itself. The loop shape is the documented one: call, and while
 * `stop_reason === 'tool_use'`, execute every block and return ALL results in a
 * single user message — splitting them across messages teaches the model to
 * stop calling tools in parallel.
 *
 * OUTPUT goes to `evals/runs/<stamp>/<case>/<label>.tsx`, never to
 * `evals/candidates/`. Those are committed fixtures that assert the scorer, and
 * a generated file landing among them would turn a finding about the model into
 * a red build. Score a run with:
 *
 *   npm run eval -- --candidates evals/runs/<stamp> --measure
 *
 * COST. Every run spends real money. The per-run sidecar records tokens and a
 * dollar estimate, and `--dry-run` prints the plan and the prompt without
 * calling anything.
 *
 *   node scripts/eval-generate.mjs [--case <name>] [--effort high] [--n 1]
 *                                  [--model claude-opus-5] [--dry-run]
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import yaml from 'js-yaml'

const root = resolve(import.meta.dirname, '..')

const args = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}
const dryRun = args.includes('--dry-run')
const onlyCase = flag('case')
const MODEL = flag('model', 'claude-opus-5')
const EFFORT = flag('effort', 'high')
const N = Number(flag('n', '1'))

/** Opus 5 list price, $/1M. Cache reads ~0.1x input, cache writes ~1.25x. */
const PRICE = { input: 5, output: 25 }

// ------------------------------------------------------------- the sandbox

/**
 * The only thing the agent can read. A path is allowed when it resolves inside
 * the repo AND is either DESIGN.md or under design/ — checked after resolve, so
 * `../../etc/passwd` and a symlink both fail rather than being pattern-matched.
 */
export function resolveDesignPath(requested) {
  const abs = resolve(root, requested)
  const rel = relative(root, abs)
  if (rel.startsWith('..')) return null
  if (rel !== 'DESIGN.md' && !rel.startsWith('design/')) return null
  if (!existsSync(abs)) return null
  return { abs, rel }
}

export function designTreeListing() {
  const out = []
  const walk = (dir) => {
    for (const e of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      const p = `${dir}/${e.name}`
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(p)
    }
  }
  walk('design')
  return out.sort()
}

export const READ_TOOL = {
  name: 'read_design_file',
  description:
    'Read one file from the Skene design system documentation tree. Paths are repo-relative, e.g. "design/index.md", "design/pages/product-page.md", "design/sections/artifact-shell.md", "design/tokens.md". Nothing outside DESIGN.md and design/ can be read. Open one file at a time and only what you need.',
  input_schema: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Repo-relative path, e.g. design/pages/product-page.md' },
    },
    required: ['path'],
    additionalProperties: false,
  },
}

const SYSTEM = `You are building one page of a marketing site for Skene, using the
@skene/design-system package. You have the package's documentation and nothing
else: no repository, no source, no component gallery.

Start from DESIGN.md, which is given below in full. It is deliberately short and
routes you to the rest. Use the read_design_file tool to open what you need —
the module index, a page template, a module page, the token values. Open what
the job needs and no more; each file is self-contained and restates the rules
that matter, so you should not need to hold several open at once.

Then write ONE file: a React server component for the page, as TypeScript TSX.

Rules for the output:
- Import every component from '@skene/design-system/<module>' using the exact
  import paths the documentation gives. Do not invent a module.
- The page supplies copy, artifacts and links. Do not restate the docs in it.
- Reply with the .tsx file and nothing else — no explanation before or after,
  no markdown code fence. The first characters of your final reply must be the
  first characters of the file.`

// ----------------------------------------------------------------- prompting

function briefFor(kase) {
  return [
    `Archetype: ${kase.archetype}`,
    '',
    `Brief: ${kase.brief.trim()}`,
    '',
    kase.must_argue?.length
      ? `The page must argue:\n${kase.must_argue.map((m) => `- ${m}`).join('\n')}`
      : '',
    '',
    'Build the page.',
  ]
    .filter((s) => s !== null)
    .join('\n')
}

// --------------------------------------------------------------------- run

async function generate(client, kase) {
  const trace = []
  const design = readFileSync(resolve(root, 'DESIGN.md'), 'utf8')

  /**
   * Stable prefix first so it caches across cases and repeats: the render order
   * is tools -> system -> messages, and DESIGN.md plus the tree listing are
   * identical for every candidate in a run. Only the brief varies, and it sits
   * after the last breakpoint.
   */
  const system = [
    { type: 'text', text: SYSTEM },
    {
      type: 'text',
      text: `Here is DESIGN.md in full:\n\n${design}\n\nThe files you can open with read_design_file:\n${designTreeListing().join('\n')}`,
      cache_control: { type: 'ephemeral' },
    },
  ]

  const messages = [{ role: 'user', content: briefFor(kase) }]
  const usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
  let turns = 0

  for (;;) {
    turns += 1
    if (turns > 24) throw new Error('tool loop did not terminate in 24 turns')

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT },
      system,
      tools: [READ_TOOL],
      messages,
    })
    const response = await stream.finalMessage()

    usage.input += response.usage.input_tokens ?? 0
    usage.output += response.usage.output_tokens ?? 0
    usage.cacheRead += response.usage.cache_read_input_tokens ?? 0
    usage.cacheWrite += response.usage.cache_creation_input_tokens ?? 0

    if (response.stop_reason === 'refusal') {
      throw new Error(`refused: ${response.stop_details?.category ?? 'unknown'}`)
    }

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason !== 'tool_use') {
      const text = response.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
      return { text, trace, usage, turns }
    }

    // Every result in ONE user message. Splitting them teaches the model to
    // stop calling tools in parallel.
    const results = []
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue
      const requested = String(block.input?.path ?? '')
      const found = resolveDesignPath(requested)
      trace.push({ path: requested, ok: Boolean(found) })
      results.push({
        type: 'tool_result',
        tool_use_id: block.id,
        is_error: !found,
        content: found
          ? readFileSync(found.abs, 'utf8')
          : `No such file in the design tree: ${requested}. Only DESIGN.md and files under design/ can be read.`,
      })
    }
    messages.push({ role: 'user', content: results })
  }
}

/** Strip a fence if the model added one despite being told not to. */
export function asTsx(text) {
  const fenced = text.match(/^\s*```(?:tsx?|typescript)?\n([\s\S]*?)\n```\s*$/)
  return (fenced ? fenced[1] : text).trim() + '\n'
}

async function main() {
  const casesDir = resolve(root, 'evals/cases')
  const cases = readdirSync(casesDir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => ({ name: basename(f, '.yaml'), ...yaml.load(readFileSync(join(casesDir, f), 'utf8')) }))
    .filter((c) => !onlyCase || c.name === onlyCase)

  if (!cases.length) throw new Error(onlyCase ? `no case named ${onlyCase}` : 'no cases')

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const outDir = resolve(root, 'evals/runs', stamp)

  if (dryRun) {
    console.log(`model ${MODEL}, effort ${EFFORT}, ${N} candidate(s) per case`)
    console.log(`cases: ${cases.map((c) => c.name).join(', ')}`)
    console.log(`would write to evals/runs/${stamp}/`)
    console.log(`\nreadable by the agent: DESIGN.md + ${designTreeListing().length} files under design/`)
    console.log(`\n--- system prompt ---\n${SYSTEM}`)
    console.log(`\n--- brief for ${cases[0].name} ---\n${briefFor(cases[0])}`)
    return
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  // Zero-arg: resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an
  // `ant auth login` profile. Never hardcode or prompt for a key.
  const client = new Anthropic()

  const runs = []
  for (const kase of cases) {
    for (let i = 0; i < N; i += 1) {
      const label = N === 1 ? 'gen' : `gen-${i + 1}`
      process.stderr.write(`${kase.name}/${label} … `)
      try {
        const { text, trace, usage, turns } = await generate(client, kase)
        const dir = join(outDir, kase.name)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, `${label}.tsx`), asTsx(text))
        const cost =
          (usage.input * PRICE.input +
            usage.cacheRead * PRICE.input * 0.1 +
            usage.cacheWrite * PRICE.input * 1.25 +
            usage.output * PRICE.output) /
          1e6
        const meta = { case: kase.name, label, model: MODEL, effort: EFFORT, turns, usage, cost, trace }
        writeFileSync(join(dir, `${label}.json`), JSON.stringify(meta, null, 2) + '\n')
        runs.push(meta)
        process.stderr.write(`${turns} turns, ${trace.length} files read, $${cost.toFixed(3)}\n`)
      } catch (err) {
        process.stderr.write(`FAILED: ${err.message}\n`)
        if (err instanceof Anthropic.AuthenticationError) {
          process.stderr.write(
            '  No usable credential. Run `ant auth login`, or export ANTHROPIC_API_KEY.\n',
          )
          process.exit(1)
        }
        if (err instanceof Anthropic.RateLimitError) {
          process.stderr.write('  Rate limited — rerun later.\n')
          process.exit(1)
        }
        if (!(err instanceof Anthropic.APIError)) throw err
      }
    }
  }

  if (!runs.length) process.exit(1)

  // The retrieval trace, which is the finding this harness exists to produce.
  const reads = runs.flatMap((r) => r.trace)
  const byPath = new Map()
  for (const t of reads) byPath.set(t.path, (byPath.get(t.path) ?? 0) + 1)
  const total = runs.reduce((n, r) => n + r.cost, 0)

  console.log(`\nwrote evals/runs/${stamp}/`)
  console.log(`${runs.length} candidate(s), $${total.toFixed(3)} total`)
  console.log(`\nfiles opened, most reached-for first:`)
  for (const [path, n] of [...byPath].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}x  ${path}`)
  }
  const misses = reads.filter((t) => !t.ok)
  if (misses.length) {
    console.log(`\n${misses.length} read(s) missed — a path the docs implied but does not exist:`)
    for (const m of [...new Set(misses.map((t) => t.path))]) console.log(`  ${m}`)
  }
  console.log(`\nscore it:\n  npm run eval -- --candidates evals/runs/${stamp} --measure`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
