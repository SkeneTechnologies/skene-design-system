#!/usr/bin/env node
/**
 * eval-judge — does the page argue the brief?
 *
 * `scripts/eval.mjs` scores what a regex can decide, and every one of its
 * checks cites a contract. `scripts/eval-render.mjs` measures contrast on real
 * pixels. Neither can answer the question the brief actually asks: does this
 * page make the argument it was commissioned to make, in an order that carries
 * it? `compositions.yaml` says a product page shows the thing running BEFORE it
 * argues about it — a page can satisfy `load_bearing` and still put the
 * evidence first, and nothing so far notices.
 *
 * So this asks a model, under three rules that keep it from becoming a vibe:
 *
 *   1. IT SCORES THE BRIEF, NOT THE TASTE. The rubric is built from the case's
 *      own `must_argue` list plus the archetype's `argues` line out of
 *      compositions.yaml. It is never asked whether the page is good.
 *   2. EVERY VERDICT CITES. A finding names the module or the section order it
 *      is about, and a finding that cites nothing is dropped before reporting —
 *      the same standard the deterministic checks are held to.
 *   3. IT NEVER OVERRIDES A CONTRACT. Where a rule is machine-checkable, the
 *      machine owns it. The judge is told so, and its findings are advisory by
 *      construction: this script does not exit non-zero on them.
 *
 * Structured output, so the result is data rather than prose to re-parse.
 *
 *   node scripts/eval-judge.mjs --candidates evals/runs/<stamp> [--case <name>]
 *                               [--model claude-opus-5] [--dry-run] [--json]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import yaml from 'js-yaml'

const root = resolve(import.meta.dirname, '..')
const readYaml = (p) => yaml.load(readFileSync(resolve(root, p), 'utf8'))
const compositions = readYaml('machine/compositions.yaml')

const args = process.argv.slice(2)
const flag = (n, d = null) => {
  const i = args.indexOf(`--${n}`)
  return i === -1 ? d : args[i + 1]
}
const dir = flag('candidates', 'evals/candidates')
const onlyCase = flag('case')
const MODEL = flag('model', 'claude-opus-5')
const dryRun = args.includes('--dry-run')
const asJson = args.includes('--json')

/** Opus 5 list price, $/1M. */
const PRICE = { input: 5, output: 25 }

const SYSTEM = `You are reviewing one page of a marketing site against the brief it
was built from, for the Skene design system.

You are NOT judging whether the page is good, tasteful, or well written. You are
judging one thing: does it make the argument the brief asked for, in an order
that carries it?

Three rules bound you:

- Where a rule is machine-checkable it is already checked and is not yours.
  Contrast ratios, token misuse, invented props, missing load-bearing modules,
  ground alternation — all measured elsewhere. Do not report them.
- Every finding must cite something in the page: a module import, a section, or
  the position of one relative to another. A finding that cites nothing is not a
  finding, and will be discarded.
- Argue from the page as written. Do not assume copy or components that are not
  in the file.

Judge the section ORDER as carefully as the section CHOICE. A page can carry
every required module and still put its evidence before the thing the evidence
is about, which reverses the argument.`

const SCHEMA = {
  type: 'object',
  properties: {
    verdict: {
      type: 'string',
      enum: ['argues-the-brief', 'partly', 'does-not'],
      description: 'Whether the page makes the argument the brief asked for.',
    },
    order_holds: {
      type: 'boolean',
      description: 'Whether the section order carries the argument rather than reversing it.',
    },
    unmet: {
      type: 'array',
      description: 'Each must_argue line the page does not deliver. Empty if all are met.',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string', description: 'The must_argue line, verbatim.' },
          why: { type: 'string', description: 'What the page does instead.' },
          cites: { type: 'string', description: 'The module, section or ordering this is about.' },
        },
        required: ['claim', 'why', 'cites'],
        additionalProperties: false,
      },
    },
    findings: {
      type: 'array',
      description: 'Other ways the page fails to carry the brief. May be empty.',
      items: {
        type: 'object',
        properties: {
          note: { type: 'string' },
          cites: { type: 'string', description: 'The module, section or ordering this is about.' },
        },
        required: ['note', 'cites'],
        additionalProperties: false,
      },
    },
  },
  required: ['verdict', 'order_holds', 'unmet', 'findings'],
  additionalProperties: false,
}

export function promptFor(kase, source) {
  const spec = compositions.archetypes[kase.archetype]
  return [
    `Archetype: ${kase.archetype}`,
    spec?.argues ? `What a page of this shape argues: ${spec.argues.trim()}` : '',
    '',
    `Brief: ${kase.brief.trim()}`,
    '',
    kase.must_argue?.length
      ? `It must argue:\n${kase.must_argue.map((m) => `- ${m}`).join('\n')}`
      : '',
    '',
    'The page as written:',
    '',
    source.trim(),
  ]
    .filter((s) => s !== null)
    .join('\n')
}

/** Rule 2, enforced rather than requested. */
function dropUncited(result) {
  const cited = (x) => typeof x?.cites === 'string' && x.cites.trim().length > 0
  const unmet = (result.unmet ?? []).filter(cited)
  const findings = (result.findings ?? []).filter(cited)
  const dropped =
    (result.unmet ?? []).length - unmet.length + ((result.findings ?? []).length - findings.length)
  return { ...result, unmet, findings, dropped }
}

function cases() {
  const casesDir = resolve(root, 'evals/cases')
  return readdirSync(casesDir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => ({ name: basename(f, '.yaml'), ...yaml.load(readFileSync(join(casesDir, f), 'utf8')) }))
    .filter((c) => !onlyCase || c.name === onlyCase)
}

function candidatesFor(name) {
  const d = resolve(root, dir, name)
  if (!existsSync(d)) return []
  return readdirSync(d)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => ({ label: basename(f, '.tsx'), source: readFileSync(join(d, f), 'utf8') }))
}

async function main() {
  const list = cases()
  if (!list.length) throw new Error(onlyCase ? `no case named ${onlyCase}` : 'no cases')

  if (dryRun) {
    const kase = list[0]
    const cand = candidatesFor(kase.name)[0]
    if (!cand) throw new Error(`no candidates under ${dir}/${kase.name}`)
    const p = promptFor(kase, cand.source)
    const est = (s) => Math.round(String(s).length / 4)
    console.log(`model ${MODEL}, structured output, advisory only`)
    console.log(`cases: ${list.map((c) => c.name).join(', ')}`)
    console.log(`\n  ${'system'.padEnd(22)} ~${est(SYSTEM)} tok`)
    console.log(`  ${'schema'.padEnd(22)} ~${est(JSON.stringify(SCHEMA))} tok`)
    console.log(`  ${`user (${kase.name})`.padEnd(22)} ~${est(p)} tok`)
    console.log(`\n${'='.repeat(76)}\nsystem\n${'='.repeat(76)}\n${SYSTEM}`)
    console.log(`\n${'='.repeat(76)}\nuser — ${kase.name}/${cand.label}\n${'='.repeat(76)}\n${p}`)
    console.log(`\n${'='.repeat(76)}\noutput schema\n${'='.repeat(76)}\n${JSON.stringify(SCHEMA, null, 2)}`)
    return
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic()

  const report = []
  let cost = 0
  for (const kase of list) {
    for (const { label, source } of candidatesFor(kase.name)) {
      process.stderr.write(`${kase.name}/${label} … `)
      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 8000,
        thinking: { type: 'adaptive' },
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        output_config: { format: { type: 'json_schema', schema: SCHEMA } },
        messages: [{ role: 'user', content: promptFor(kase, source) }],
      })
      const res = await stream.finalMessage()
      if (res.stop_reason === 'refusal') {
        process.stderr.write(`refused (${res.stop_details?.category ?? 'unknown'})\n`)
        continue
      }
      const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('')
      const parsed = dropUncited(JSON.parse(text))
      cost += (res.usage.input_tokens * PRICE.input + res.usage.output_tokens * PRICE.output) / 1e6
      report.push({ case: kase.name, label, ...parsed })
      process.stderr.write(
        `${parsed.verdict}${parsed.dropped ? `, ${parsed.dropped} uncited dropped` : ''}\n`,
      )
    }
  }

  if (asJson) return void console.log(JSON.stringify(report, null, 2))
  for (const r of report) {
    const mark = r.verdict === 'argues-the-brief' ? '\x1b[32m✓\x1b[0m' : '\x1b[33m~\x1b[0m'
    console.log(`\n${mark} ${r.case}/${r.label}  ${r.verdict}, order ${r.order_holds ? 'holds' : 'does not hold'}`)
    for (const u of r.unmet) console.log(`    unmet: ${u.claim}\n      ${u.why}  [${u.cites}]`)
    for (const f of r.findings) console.log(`    ${f.note}  [${f.cites}]`)
  }
  console.log(`\n$${cost.toFixed(3)}. Advisory — this never fails a build.`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}

export { SYSTEM, SCHEMA, dropUncited }
