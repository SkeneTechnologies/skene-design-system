import { Button } from '@skene/design-system/ui/button'
import { Badge } from '@skene/design-system/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@skene/design-system/ui/card'
import { HeroBackdrop } from '@skene/design-system/patterns/hero-backdrop'
import { Terminal, TerminalLine } from '@skene/design-system/patterns/terminal'

/**
 * Page-level compositions.
 *
 * The component inventory on the index page answers "what is in the box". This
 * answers the question that actually matters when adopting the package: what
 * does a page built from it look like, on each surface.
 *
 * Nothing here is defined locally except copy and layout. Every visual
 * treatment is either a package pattern or a class from styles/effects.css.
 */

/** What a public marketing page looks like: dark, textured, brand-led. */
function MarketingPage() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <HeroBackdrop className="skene-bloom px-8 py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-text-muted">
          Tracking that holds
        </p>
        <h2 className="mt-3 max-w-lg text-[34px] leading-[1.15] tracking-[-0.02em] text-chrome-text-primary">
          Catch the break <span className="skene-gradient-text">on the PR</span>
        </h2>
        <p className="mt-3 max-w-md text-[13px] text-chrome-text-muted">
          A renamed event passes every test, ships green, and sits broken for
          weeks before anyone notices.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="skene-glow-md">Start free</Button>
          <Button variant="outline">Install Skene</Button>
        </div>
      </HeroBackdrop>

      <div className="bg-chrome-surface-0 px-8 py-10">
        <hr className="skene-gradient-rule mb-8" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['engineering', 'Reads your schema'],
            ['success', 'Comments on the PR'],
            ['product', 'Keeps the plan honest'],
          ].map(([tone, label]) => (
            <div
              key={tone}
              data-neon={tone}
              className="skene-neon rounded-md bg-chrome-surface-1 p-4"
            >
              <p className="skene-neon-text text-[11px] uppercase tracking-[0.16em]" data-neon={tone}>
                {tone}
              </p>
              <p className="mt-2 text-[13px] text-chrome-text-primary">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-xl">
          <Terminal title="skene">
            <TerminalLine prompt>uvx skene analyse-journey .</TerminalLine>
            <TerminalLine className="text-[var(--color-semantic-matcha)]">
              ✓ 42 events matched the tracking plan
            </TerminalLine>
            <TerminalLine className="text-[var(--color-semantic-error-red)]">
              ✗ checkout_started renamed, 3 call sites stale
            </TerminalLine>
          </Terminal>
        </div>
      </div>
    </div>
  )
}

/** What a signed-in dashboard page looks like: dense, calm, semantic. */
function DashboardPage() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      {/* text-foreground is load-bearing: without it this inherits the body's
          colour from outside the .light wrapper and renders light-on-light. */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3 text-foreground">
        <div className="flex items-center gap-3">
          <span className="text-[13px]">Tracking plans</span>
          <Badge variant="secondary">3 changed</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Review diff
          </Button>
          <Button size="sm">Approve</Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3">
        {[
          ['98%', 'Events captured'],
          ['12', 'Broken triggers'],
          ['3.4s', 'Median deploy'],
        ].map(([v, l]) => (
          <Card key={l}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{v}</CardTitle>
            </CardHeader>
            <CardContent className="text-[12px] text-muted-foreground">{l}</CardContent>
          </Card>
        ))}
      </div>

      {/* Fixed chrome inside a themed page: the panel stays dark either way. */}
      <div className="px-5 pb-5">
        <div className="overflow-hidden rounded-md border border-chrome-surface-border">
          {['events_tracked', 'checkout_started', 'plan_upgraded'].map((row, i) => (
            <div
              key={row}
              className={`flex items-center justify-between px-3 py-2 font-mono text-[12px] ${
                i % 2 ? 'bg-chrome-surface-deep-2' : 'bg-chrome-surface-0'
              }`}
            >
              <span className="text-chrome-text-primary">{row}</span>
              <span className="text-chrome-text-muted">{(i + 1) * 1284}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SurfacesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-10">
        <h1 className="text-3xl">Page compositions</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          What a page built from this package looks like on each surface. The
          index page is the inventory; this is the answer to &ldquo;will my new
          app look like Skene&rdquo;. Every treatment here is a package pattern
          or a class from <code className="text-xs">effects.css</code>.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-1 text-xl">Marketing surface</h2>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Dark, textured, brand-led. HeroBackdrop with a peach bloom, the
          bronze-to-gold gradient on emphasis, neon accents driven by{' '}
          <code className="text-xs">color.neon.*</code>, and the terminal frame.
          No backdrop image is passed here, so only the gradient shows — the
          package ships no assets.
        </p>
        <MarketingPage />
      </section>

      <section>
        <h2 className="mb-1 text-xl">Dashboard surface</h2>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Dense and semantic, on the shadcn layer, with fixed dark chrome for the
          data table. Shown light, which is the dashboard&rsquo;s default; note
          the table stays dark inside it.
        </p>
        <div className="light">
          <DashboardPage />
        </div>
      </section>
    </main>
  )
}
