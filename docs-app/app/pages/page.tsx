import { Button } from '@skene/design-system/ui/button'
import { Input } from '@skene/design-system/ui/input'
import { Card, CardContent } from '@skene/design-system/ui/card'
import { DitheredMedia } from '@skene/design-system/patterns/dither'
import {
  PillNav, PillNavLink, Eyebrow, DisplayHeading, Accent, NumberedStep, SplitAuthLayout,
} from '@skene/design-system/patterns/marketing'

/**
 * The three live Skene pages, rebuilt from package parts only.
 *
 * This is the acceptance test for "will a new app look like Skene". If a page
 * on www.skene.ai cannot be reconstructed from what ships here, the package is
 * missing something, and the gap is visible rather than argued about.
 *
 * Textures are not shipped, so `dither` and `video` are left unset: the
 * composition still reads correctly, just flatter. Pass real assets to close
 * the remaining distance.
 */

function Home() {
  return (
    <DitheredMedia className="min-h-[520px]">
      <PillNav
        brand={<span className="text-[15px] font-medium text-chrome-text-primary">Skene</span>}
        actions={
          <>
            <Button variant="outline" size="sm">Log In</Button>
            <Button size="sm">Start free</Button>
          </>
        }
      >
        {['Product', 'Pricing', 'Docs', 'Blog'].map((l) => (
          <PillNavLink key={l} href="#">{l}</PillNavLink>
        ))}
      </PillNav>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-40 text-center">
        <DisplayHeading size="hero">
          Trust your product data.
          <br />
          <Accent>Live in one click.</Accent>
        </DisplayHeading>
        <p className="mx-auto mt-6 max-w-xl text-[14px] leading-relaxed text-chrome-text-muted">
          Product analytics in your own Supabase, working with any dashboard you
          use. Skene runs as a GitHub Action on every pull request.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button>Start free</Button>
          <Button variant="outline">▶ Watch a demo</Button>
        </div>
      </div>
    </DitheredMedia>
  )
}

function HowItWorks() {
  return (
    <div className="bg-chrome-surface-darker">
      <DitheredMedia className="pb-10">
        <div className="mx-auto max-w-4xl px-6 pt-14">
          <p className="mb-4 text-[12px] text-chrome-text-muted">
            Home <span className="opacity-40">/</span> Product{' '}
            <span className="opacity-40">/</span>{' '}
            <span className="text-chrome-text-primary">How it works</span>
          </p>
          <Eyebrow>How it works</Eyebrow>
          <DisplayHeading size="page" className="mt-4 max-w-2xl">
            Setup, the PR check, and the fix.
          </DisplayHeading>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-chrome-text-muted">
            No SDK to swap, no data pipeline to wire up. Skene reads the
            event-writing code and the Supabase schema you already have.
          </p>
        </div>
      </DitheredMedia>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-14">
        <NumberedStep n="01" title="Setup">
          Connect the repository and your Supabase project, read-only. Skene
          scans the code for every write that records an event.
        </NumberedStep>
        <NumberedStep n="02" title="The PR check">
          On every pull request, Skene re-reads the changed files and checks that
          each event still fires and still matches the table it belongs to.
        </NumberedStep>
        <NumberedStep n="03" title="The fix">
          When Skene finds a break, it proposes the corrected write as a commit
          on the same PR.
        </NumberedStep>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div className="bg-chrome-surface-darker">
      <SplitAuthLayout
        className="min-h-[560px]"
        form={
          <div className="text-center">
            <h2 className="text-[22px] text-chrome-text-primary">Sign in</h2>
            <p className="mt-2 text-[13px] text-chrome-text-muted">
              Enter your email to receive a magic link.
            </p>
            <div className="mt-6 space-y-3 text-left">
              <Input placeholder="you@company.com" />
              <Button className="w-full">Continue with email</Button>
            </div>
            <p className="mt-4 text-[12px] text-chrome-text-muted">
              Do not have an account?{' '}
              <a href="#" className="text-brand-peach">Sign up</a>
            </p>
          </div>
        }
        meta={
          <>
            <span>Secure sign in</span>
            <span>Magic link auth</span>
            <span>No credit card required</span>
          </>
        }
        showcase={
          <div className="flex h-full items-center justify-center bg-brand-light p-10">
            <Card className="light w-full max-w-md">
              <CardContent className="p-6 text-center">
                <p className="text-[14px] font-medium">Starting journey analysis…</p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  This may take a few minutes.
                </p>
                <div className="mt-6 flex items-center justify-between gap-2 text-[11px]">
                  {[
                    ['Analyzing Schema', 'var(--color-semantic-matcha-deep)'],
                    ['Events from codebase', 'var(--color-brand-peach)'],
                    ['Generating Journey', 'var(--color-chrome-text-muted)'],
                  ].map(([label, colour]) => (
                    <div key={label} className="flex-1">
                      <div
                        className="mx-auto mb-2 h-8 w-8 rounded-full border-2"
                        style={{ borderColor: colour as string }}
                      />
                      <span style={{ color: colour as string }}>{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </div>
  )
}

function Frame({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-xl">{title}</h2>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">{note}</p>
      <div className="overflow-hidden rounded-lg border border-border">{children}</div>
    </section>
  )
}

export default function LivePagesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header className="mb-10">
        <h1 className="text-3xl">Live pages, rebuilt from the package</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Three real skene.ai pages reconstructed using only what this package
          ships. If one of them cannot be built here, the package is missing
          something. Textures and product imagery are not shipped, so those slots
          are empty and the compositions read flatter than the live site.
        </p>
      </header>

      <Frame
        title="skene.ai"
        note="DitheredMedia + PillNav + DisplayHeading(hero, 67px) + Accent. The live hero layers a video and a dither texture under the gradient; both are props here."
      >
        <Home />
      </Frame>

      <Frame
        title="/product/how-it-works"
        note="Eyebrow chip, DisplayHeading(page, 48px), and NumberedStep for the peach mono 01 / 02 / 03."
      >
        <HowItWorks />
      </Frame>

      <Frame
        title="/login"
        note="SplitAuthLayout. Worth having here because login is served by a third repo at the same origin, so this layout lived somewhere neither app could see."
      >
        <Login />
      </Frame>
    </main>
  )
}
