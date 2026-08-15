import Image from 'next/image'

/**
 * Demo-capture coverage.
 *
 * `site-capture-skene-demo` is the two-page Stand microsite the section layer was
 * extracted from (Stage 2, `machine/components.yaml`). Every band of that capture
 * now has a component. The five crops below were the gap, taken straight out of the
 * capture PNGs so it was visible rather than asserted; they are kept after the fact
 * as the before-picture next to what shipped.
 *
 * Each card names the nearest thing the package already ships, because "no
 * component" and "no component that fits" are different problems: the first is a
 * build, the second is usually a prop on something that exists.
 */

type Gap = {
  file: string
  width: number
  height: number
  title: string
  where: string
  nearest: string
  why: string
  /** What closed it, and when. */
  builtAs: string
}

const GAPS: Gap[] = [
  {
    file: '/gaps/gap-score-ring.png',
    width: 630,
    height: 200,
    title: 'Coverage score ring',
    where: 'Home, section 4 — artifact 01, "Product data audit"',
    nearest: 'OverviewTiles carries a number; AnnotatedCurve is the only other SVG figure.',
    why: 'A partial arc on a track with the value inside it. Nothing in the package draws an arc — AnnotatedCurve is a spline, and PipelineStepper’s circles are step dots with no progress semantics.',
    builtAs: 'ScoreRing — sections/score-ring.tsx',
  },
  {
    file: '/gaps/gap-agent-callout.png',
    width: 1230,
    height: 135,
    title: 'Agent verdict callout',
    where: 'Home, section 2 — under the activation funnel',
    nearest: 'EvaluatorNote is a 12px note with no avatar, no eyebrow, no frame.',
    why: 'Avatar, mono eyebrow, the claim in bold, a dot-separated evidence line, inside a peach-bordered frame on its own tinted ground. It is the moment Skene speaks on the page, and it recurs.',
    builtAs: 'AgentCallout — sections/agent-callout.tsx',
  },
  {
    file: '/gaps/gap-agent-callout-2.png',
    width: 605,
    height: 95,
    title: 'Agent verdict callout — second instance',
    where: 'Home, section 4 — artifact 02, inside the release window',
    nearest: 'Same as above.',
    why: 'Same shape, one line shorter and no eyebrow, nested inside a dark window instead of standing on the page. Two instances is what makes it a component rather than a one-off.',
    builtAs: 'AgentCallout, same component, fewer slots filled',
  },
  {
    file: '/gaps/gap-recommendation.png',
    width: 600,
    height: 170,
    title: 'Recommendation card',
    where: 'Home, section 4 — artifact 03, "Journey improvement"',
    nearest: 'MetaChip covers the two pills; the card around them does not exist.',
    why: 'Mono eyebrow, proposal title, the action in body text, then a row of qualifier chips. Finding is the wrong shape: it reports a measured status, this proposes a next step.',
    builtAs: 'RecommendationCard — sections/recommendation-card.tsx',
  },
  {
    file: '/gaps/gap-faq.png',
    width: 1260,
    height: 380,
    title: 'FAQ band',
    where: 'Pricing, section 5',
    nearest: 'ui/accordion is the primitive. No section wraps it.',
    why: 'A full-bleed cream band: heading column left, rows right, a hairline between every row, circular toggle at the right edge. Every other marketing band on the demo ships as a section; this one is still hand-assembly in the app.',
    builtAs: 'FaqBand + FaqRow — sections/faq-band.tsx',
  },
]

function GapCard({ gap }: { gap: Gap }) {
  return (
    <article className="min-w-0 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-lg">{gap.title}</h2>
        <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          built 2026-08-13
        </span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{gap.where}</p>

      <div className="mt-4 w-full min-w-0 overflow-x-auto rounded-lg border border-border p-3">
        <Image
          src={gap.file}
          width={gap.width}
          height={gap.height}
          alt={`${gap.title}, cropped from the demo capture`}
          className="h-auto max-w-none rounded"
          unoptimized
        />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Nearest thing shipped
          </dt>
          <dd className="mt-1 text-muted-foreground">{gap.nearest}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Why it is not that
          </dt>
          <dd className="mt-1 text-muted-foreground">{gap.why}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Ships as
          </dt>
          <dd className="mt-1">{gap.builtAs}</dd>
        </div>
      </dl>
    </article>
  )
}

const COVERED: Array<[string, string]> = [
  ['Sticky pill nav', 'PillNav, PillNavLink'],
  ['Hero over dithered photography', 'DitheredMedia, DisplayHeading, Accent, Eyebrow'],
  ['Activation funnel window', 'Funnel, AppWindow, MetricCard, Sparkline'],
  ['Journey steps with a state-carrying connector', 'JourneyTrack, JourneyStep'],
  ['GTM / Skene / Engineering bridge', 'Bridge, BridgeNode'],
  ['Three jobs, alternating copy and mock', 'FeatureRow, SectionBackdrop, CheckList'],
  ['Audit findings on a light window', 'Finding, StatPill, ProductWindow'],
  ['Journey improvement bars', 'MiniFunnel'],
  ['Numbered how-it-works list', 'NumberedStep'],
  ['Use-case question cards', 'QuestionGrid, QuestionCard'],
  ['Trust panel, cream split', 'TrustPanel, TrustFact'],
  ['Ask-us widget', 'AskWidget'],
  ['Plan cards and billing toggle', 'PlanGrid, PlanCard, BillingToggle'],
  ['Plan comparison table', 'ComparisonTable, ComparisonRow, TableCheck, TableDash'],
  ['Cost-of-waiting contrast pair', 'ValueCards, ValueCard'],
  ['Closing CTA over halftone', 'FinalCta'],
  ['Footer', 'SiteFooter and parts'],
  ['Four surfaces on a halftone field', 'SurfaceTiles, SurfaceTile, SurfaceDetail'],
  ['The Skene symbol, wherever the product speaks', 'SkeneMark'],
]

export default function GapsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl">Demo capture — coverage</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Cropped from <code className="font-mono">site-capture-skene-demo/screenshots</code>, the
        two-page Stand microsite this package&apos;s section layer was extracted from. Cropping
        the capture PNGs found five elements with no component — the five below. Two more turned
        up afterwards, in the &ldquo;four ways to plug Skene in&rdquo; composition rather than in
        the capture: the surface tiles and the detail panel under them. That is seven, and all
        seven shipped on 2026-08-13. Each crop below is the original, with what now covers it.
      </p>

      <div className="mt-8 grid gap-5">
        {GAPS.map((gap) => (
          <GapCard key={gap.file} gap={gap} />
        ))}
      </div>

      <section className="mt-14 border-t border-border pt-8">
        <h2 className="text-xl">Covered</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every other band of both captured pages, and what it ships as.
        </p>
        <ul className="mt-5 grid list-none gap-2 p-0 sm:grid-cols-2">
          {COVERED.map(([band, ships]) => (
            <li key={band} className="rounded-lg border border-border px-3 py-2.5">
              <p className="text-sm">{band}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{ships}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
