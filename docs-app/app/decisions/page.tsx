'use client'

import { useMemo, useState } from 'react'
import inventory from './inventory.json'

/**
 * The catalogue: everything the package exports, filterable, with the open
 * decisions at the top.
 *
 * The module list is GENERATED (scripts/build-inventory.mjs) rather than typed
 * here. A hand-written catalogue is wrong within a week and wrong silently,
 * which is worse than no catalogue — a page claiming to list everything is
 * trusted precisely when it has started missing things.
 *
 * The decisions are hand-written, because a decision is a judgement. Deriving
 * them from source could only restate the duplication, not say what to do.
 */

type Layer = 'ui' | 'patterns' | 'sections'
const LAYERS: Layer[] = ['ui', 'patterns', 'sections']

const LAYER_BLURB: Record<Layer, string> = {
  ui: 'a control',
  patterns: 'page furniture — a recurring treatment, not a whole band',
  sections: 'a whole band of a page, carrying layout and an argument',
}

/** Which modules a decision touches, so a row can be marked "contested". */
const CONTESTED = new Set(
  inventory.decisions
    .filter((d) => d.status !== 'resolved')
    .flatMap((d) => d.options.map((o) => o.split(' ')[0])),
)

/**
 * Counted, not written down. The blurb used to say "the two open decisions" and
 * went stale the moment one was applied — the same failure mode the generated
 * module list exists to avoid.
 */
const OPEN_COUNT = inventory.decisions.filter((d) => d.status !== 'resolved').length

/**
 * Typed explicitly because the JSON is generated: when the list empties, TS
 * infers `never[]` from the literal and every property access on a row fails to
 * compile. The list going to zero is the goal, so it must not break the build.
 */
type Unbuilt = { name: string; note: string }
const unbuilt = inventory.unbuilt as Unbuilt[]

export default function DecisionsPage() {
  const [q, setQ] = useState('')
  const [layer, setLayer] = useState<Layer | 'all'>('all')
  const [only, setOnly] = useState<'all' | 'contested' | 'client' | 'no visual' | 'no usage'>('all')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return inventory.modules.filter((m) => {
      if (layer !== 'all' && m.layer !== layer) return false
      if (only === 'client' && !m.client) return false
      if (only === 'no visual' && (m.cases.length > 0 || m.demo)) return false
      if (only === 'no usage' && m.usage) return false
      if (only === 'contested' && !m.exports.some((e) => CONTESTED.has(e))) return false
      if (!needle) return true
      return (
        m.module.toLowerCase().includes(needle) ||
        m.summary.toLowerCase().includes(needle) ||
        m.exports.some((e) => e.toLowerCase().includes(needle))
      )
    })
  }, [q, layer, only])

  const shownExports = rows.reduce((n, m) => n + m.exports.length, 0)

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl">Catalogue &amp; open decisions</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every module the package exports, generated from source. Each decision below is
          duplication that has already happened.{' '}
          {OPEN_COUNT === 0
            ? 'All are decided and applied.'
            : `${OPEN_COUNT} of ${inventory.decisions.length} is decided but not yet applied.`}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every card links to the component rendered in isolation on{' '}
          <a href="/components" className="text-brand-peach underline underline-offset-4">
            /components
          </a>{' '}
          ({inventory.gallery.cases} cases, both modes), and to a composed route where it is
          shown in context. You cannot choose between two components from their names.{' '}
          {inventory.counts.withUsage} carry reuse guidance — what else they do, what will
          bite, and what they are the wrong answer to.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          {LAYERS.map((l) => (
            <span
              key={l}
              className="rounded-full border border-chrome-line-subtle px-3 py-1 text-text-muted"
            >
              {inventory.counts[l]} {l} — {LAYER_BLURB[l]}
            </span>
          ))}
        </div>
      </header>

      {/* Decisions first: they are the reason to open this page. */}
      <section className="mb-12 space-y-4">
        {inventory.decisions.map((d) => {
          const open = d.status !== 'resolved'
          return (
            <div
              key={d.id}
              className="rounded-2xl border p-5"
              style={{
                borderColor: open
                  ? 'color-mix(in oklab, var(--color-semantic-warning-amber) 40%, transparent)'
                  : 'var(--color-chrome-line-subtle)',
                background: 'var(--color-chrome-surface-1)',
              }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span
                  className="rounded-[5px] px-[7px] py-1 font-mono text-[10px] uppercase tracking-[0.08em]"
                  style={{
                    background: open
                      ? 'color-mix(in oklab, var(--color-semantic-warning-amber) 18%, transparent)'
                      : 'color-mix(in oklab, var(--color-semantic-matcha) 16%, transparent)',
                    color: open
                      ? 'var(--color-semantic-warning-amber)'
                      : 'var(--color-semantic-matcha)',
                  }}
                >
                  {/* Three states, not two. A decision whose first point shipped
                      and whose rest has not is neither "resolved" nor "not
                      applied", and labelling it either way is how a page like
                      this stops being believed. */}
                  {d.status === 'resolved'
                    ? 'resolved'
                    : d.status === 'partly-applied'
                      ? 'partly applied'
                      : 'decided · not applied'}
                </span>
                <h2 className="text-[17px] text-chrome-text-primary">{d.title}</h2>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {d.options.map((o) => (
                  <code
                    key={o}
                    className="rounded border border-chrome-line-subtle px-2 py-0.5 text-[11px] text-chrome-text-muted-warm"
                  >
                    {o}
                  </code>
                ))}
              </div>

              <p className="mb-2 text-[14px] text-brand-peach">{d.verdict}</p>
              <p className="max-w-3xl text-[13px] leading-relaxed text-chrome-text-muted-warm">
                {d.detail}
              </p>

              {d.evidence.length > 0 && (
                <pre className="mt-3 overflow-x-auto rounded-lg bg-chrome-surface-deep-2 p-3 font-mono text-[11px] leading-relaxed text-chrome-text-muted-warm">
                  {d.evidence.join('\n')}
                </pre>
              )}
            </div>
          )
        })}
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-2 bg-background/95 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name, export, or purpose…"
          className="min-w-[240px] flex-1 rounded-lg border border-chrome-line-subtle bg-chrome-surface-1 px-3 py-2 text-[13px] text-chrome-text-primary placeholder:text-chrome-text-muted-warm"
        />
        <Seg value={layer} onChange={setLayer} options={['all', ...LAYERS]} />
        <Seg value={only} onChange={setOnly} options={['all', 'contested', 'client', 'no visual', 'no usage']} />
        <span className="ml-auto font-mono text-[11px] text-text-muted">
          {rows.length} modules · {shownExports} exports
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((m) => {
          const contested = m.exports.filter((e) => CONTESTED.has(e))
          return (
            <div
              key={`${m.layer}/${m.module}`}
              className="rounded-xl border border-chrome-line-subtle bg-chrome-surface-1 p-4"
            >
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-[15px] text-chrome-text-primary">{m.module}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
                  {m.layer}
                </span>
                {m.client && (
                  <span className="rounded border border-chrome-line-subtle px-1.5 font-mono text-[9px] uppercase text-accent-blue">
                    client
                  </span>
                )}
                {contested.length > 0 && (
                  <span
                    className="rounded px-1.5 font-mono text-[9px] uppercase"
                    style={{
                      background:
                        'color-mix(in oklab, var(--color-semantic-warning-amber) 18%, transparent)',
                      color: 'var(--color-semantic-warning-amber)',
                    }}
                  >
                    decision
                  </span>
                )}
              </div>
              {m.summary && (
                <p className="mb-2 text-[12px] leading-relaxed text-chrome-text-muted-warm">
                  {m.summary}
                </p>
              )}
              <div className="mb-2 flex flex-wrap gap-1">
                {m.exports.map((e) => (
                  <code
                    key={e}
                    className="rounded px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: CONTESTED.has(e)
                        ? 'color-mix(in oklab, var(--color-semantic-warning-amber) 14%, transparent)'
                        : 'var(--color-chrome-surface-2)',
                      color: CONTESTED.has(e)
                        ? 'var(--color-semantic-warning-amber)'
                        : 'var(--color-chrome-text-muted-warm)',
                    }}
                  >
                    {e}
                  </code>
                ))}
              </div>
              <code className="mb-2 block truncate font-mono text-[10px] text-text-muted">
                {m.import}
              </code>

              {/* Reuse guidance. Collapsed by default: the catalogue's job is
                  scanning, and four paragraphs per card would defeat it. Open
                  when you are deciding, which is when you need the depth. */}
              {m.usage && (
                <details className="mb-2 group">
                  <summary className="cursor-pointer list-none text-[11px] text-brand-peach marker:hidden">
                    <span className="group-open:hidden">
                      what else can this do? ({m.usage.alsoFor.length} other uses,{' '}
                      {m.usage.watchFor.length} gotchas) ▸
                    </span>
                    <span className="hidden group-open:inline">less ▾</span>
                  </summary>
                  <div className="mt-2 space-y-3 border-l border-chrome-line-subtle pl-3">
                    <p className="text-[12px] leading-relaxed text-chrome-text-muted-warm">
                      {m.usage.purpose}
                    </p>
                    <UsageList
                      title="Also works for"
                      items={m.usage.alsoFor}
                      colour="var(--color-semantic-matcha)"
                    />
                    <UsageList
                      title="Watch for"
                      items={m.usage.watchFor}
                      colour="var(--color-semantic-warning-amber)"
                    />
                    <UsageList
                      title="Not for"
                      items={m.usage.notFor}
                      colour="var(--color-semantic-error-red)"
                    />
                  </div>
                </details>
              )}

              {/* The point of the page is choosing between things, which is
                  impossible from names alone. Isolated case first — it is the
                  one captured in both modes — then the composed route. */}
              <div className="flex flex-wrap gap-1.5">
                {m.cases.map((c) => (
                  <a
                    key={c}
                    href={`/components#${c}`}
                    className="rounded border px-2 py-0.5 text-[11px] transition-colors"
                    style={{
                      borderColor: 'color-mix(in oklab, var(--color-brand-peach) 35%, transparent)',
                      color: 'var(--color-brand-peach)',
                    }}
                  >
                    see {c.replace(/^(ui|pattern|section)-/, '')} →
                  </a>
                ))}
                {m.demo && (
                  <a
                    href={m.demo}
                    className="rounded border border-chrome-line-strong px-2 py-0.5 text-[11px] text-chrome-text-muted-warm transition-colors hover:text-brand-peach"
                  >
                    in context {m.demo} →
                  </a>
                )}
                {m.cases.length === 0 && !m.demo && (
                  <span className="text-[11px] text-text-muted">no visual yet</span>
                )}
              </div>
            </div>
          )
        })}
        {rows.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-text-muted">
            Nothing matches. The catalogue is generated, so an empty result means it is
            genuinely absent rather than merely unlisted.
          </p>
        )}
      </div>

      <section className="mt-12">
        <h2 className="mb-1 text-xl">
          {unbuilt.length === 0 ? 'Nothing outstanding' : 'Not built'}
        </h2>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          {unbuilt.length === 0
            ? 'Every archetype identified on the captured demo and the live homepage now has a form in the package. New gaps belong here as they are found.'
            : 'Archetypes on the demo or prototype with no form in the package. Listed here so the gap is visible beside the inventory rather than being rediscovered.'}
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          {unbuilt.map((u) => (
            <div
              key={u.name}
              className="rounded-lg border border-dashed border-chrome-line-strong p-3"
            >
              <h3 className="text-[14px] text-chrome-text-muted-warm-strong">{u.name}</h3>
              <p className="text-[12px] text-text-muted">{u.note}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function UsageList({
  title,
  items,
  colour,
}: {
  title: string
  items: string[]
  colour: string
}) {
  if (items.length === 0) return null
  return (
    <div>
      <p
        className="mb-1 font-mono text-[9px] uppercase tracking-[0.08em]"
        style={{ color: colour }}
      >
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((t, i) => (
          <li
            key={i}
            className="text-[12px] leading-relaxed text-chrome-text-muted-warm before:mr-1.5 before:content-['—']"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: readonly string[]
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-chrome-line-subtle">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o as T)}
          className="px-3 py-2 text-[12px] transition-colors"
          style={{
            background: value === o ? 'var(--color-chrome-surface-2)' : 'transparent',
            color:
              value === o
                ? 'var(--color-chrome-text-primary)'
                : 'var(--color-chrome-text-muted-warm)',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
