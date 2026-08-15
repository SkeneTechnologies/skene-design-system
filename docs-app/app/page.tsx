import { Button } from '@skene/design-system/ui/button'
import { Badge } from '@skene/design-system/ui/badge'
import { Input } from '@skene/design-system/ui/input'
import { Textarea } from '@skene/design-system/ui/textarea'
import { Label } from '@skene/design-system/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@skene/design-system/ui/alert'
import { Skeleton } from '@skene/design-system/ui/skeleton'
import { Switch } from '@skene/design-system/ui/switch'
import { Checkbox } from '@skene/design-system/ui/checkbox'
import { Progress } from '@skene/design-system/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@skene/design-system/ui/tabs'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@skene/design-system/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@skene/design-system/ui/table'
import {
  ProductWindow, WindowStatus, WindowToolbar, WindowChip,
} from '@skene/design-system/sections/product-window'
import { Finding, MetricCard, Sparkline } from '@skene/design-system/sections/finding-card'
import { FeatureRow, FeatureStack, FeatureIcon } from '@skene/design-system/sections/feature-row'
import { FinalCta } from '@skene/design-system/sections/final-cta'
import {
  SiteFooter, FooterColumn, FooterLink, SocialLinks, SocialLink,
} from '@skene/design-system/sections/footer'
import { PricingDemo } from './pricing-demo'

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const

function Section({
  n, title, children, note,
}: {
  n: string
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-10">
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {n}
        </p>
        <h2 className="mt-1 text-2xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  )
}

/** Every primitive on this page comes from the package. Nothing is defined locally. */
function Primitives() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {BUTTON_SIZES.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-2">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge>default</Badge>
        <Badge variant="secondary">secondary</Badge>
        <Badge variant="destructive">destructive</Badge>
        <Badge variant="outline">outline</Badge>
      </div>

      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="a">Label</Label>
          <Input id="a" placeholder="Placeholder" />
          <Input defaultValue="With a value" />
          <Input disabled placeholder="Disabled" />
          <Textarea placeholder="Textarea" rows={3} />
        </div>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>The tracking plan changed on this branch.</AlertDescription>
          </Alert>
          <div className="flex items-center gap-3 text-sm">
            <Switch id="s" /> <Label htmlFor="s">Switch</Label>
            <Checkbox id="c" /> <Label htmlFor="c">Checkbox</Label>
          </div>
          <Progress value={62} />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="one" className="max-w-md">
        <TabsList>
          <TabsTrigger value="one">Overview</TabsTrigger>
          <TabsTrigger value="two">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="one" className="pt-3 text-sm text-muted-foreground">
          First panel
        </TabsContent>
        <TabsContent value="two" className="pt-3 text-sm text-muted-foreground">
          Second panel
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Dashboard chrome: `chrome.*`, the fixed dark ladder. Panels stay dark whether
 * the page around them is light or dark, the way a terminal or code block does.
 */
function ChromeSurface() {
  return (
    <div className="rounded-md border border-chrome-surface-border bg-chrome-surface-1 p-4">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
        chrome.surface / chrome.text
      </p>
      <div className="mb-3 rounded-sm bg-chrome-surface-2 p-3">
        <p className="text-[13px] text-chrome-text-primary">Panel on chrome-surface-2</p>
        <p className="text-[12px] text-chrome-text-muted">Muted supporting copy.</p>
      </div>
      <div className="overflow-hidden rounded-sm border border-chrome-surface-border">
        {['events_tracked', 'checkout_started', 'plan_upgraded'].map((row, i) => (
          <div
            key={row}
            className={`flex items-center justify-between px-3 py-2 text-[12px] ${
              i % 2 ? 'bg-chrome-surface-deep-2' : 'bg-chrome-surface-0'
            }`}
          >
            <span className="text-chrome-text-primary">{row}</span>
            <span className="text-chrome-text-muted">{(i + 1) * 1284}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Marketing surface: `surface.*`, theme-aware. The same shape follows the page,
 * inverting to a zinc ladder in light.
 */
function ThemedSurface() {
  return (
    <div className="rounded-md border border-surface-border bg-surface-1 p-4">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-text-muted">
        surface / text
      </p>
      <div className="mb-3 rounded-sm bg-surface-2 p-3">
        <p className="text-[13px] text-text-primary">Panel on surface-2</p>
        <p className="text-[12px] text-text-muted">Muted supporting copy.</p>
      </div>
      <div className="overflow-hidden rounded-sm border border-surface-border">
        {['events_tracked', 'checkout_started', 'plan_upgraded'].map((row, i) => (
          <div
            key={row}
            className={`flex items-center justify-between px-3 py-2 text-[12px] ${
              i % 2 ? 'bg-surface-deep-2' : 'bg-surface-0'
            }`}
          >
            <span className="text-text-primary">{row}</span>
            <span className="text-text-muted">{(i + 1) * 1284}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The nine tokens added in 2.6.0, reconciled out of the Stand demo capture.
 *
 * Rendered as the decisions they encode rather than as a swatch grid: the point
 * of each panel is the comparison, because in every case a plausible cheaper
 * option was rejected and the reason is only visible side by side.
 *
 * Everything here is fixed-dark `chrome.*` / `accent.*`, so it deliberately does
 * NOT get the light/dark treatment the sections above do. These colours have no
 * designed light value and `roles.test.ts` asserts they never gain one silently.
 */
function NewTokens() {
  return (
    <div className="space-y-4">
      {/* A. The §D call: fade the brand cream, not the package's white. */}
      <div className="rounded-md border border-chrome-line-subtle bg-chrome-surface-1 p-4">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
          chrome.text.mutedWarm — decided
        </p>
        <p className="mb-4 text-[12px] text-chrome-text-muted">
          Both rows clear AA. The question was never contrast, it was which
          direction muted text should travel as it gets quieter.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-chrome-line-subtle p-3">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-blue">
              warm — shipped
            </p>
            <p className="text-[13px] text-chrome-text-primary">Product data your GTM team can trust.</p>
            <p className="mt-1 text-[12px] text-chrome-text-muted-warm-strong">
              Skene sits between Growth, Marketing, and Engineering.
            </p>
            <p className="mt-1 text-[12px] text-chrome-text-muted-warm">
              It finds gaps in product tracking before they corrupt dashboards.
            </p>
            <p className="mt-2 font-mono text-[9px] text-chrome-text-muted">7.91:1 · fades #faf1e9</p>
          </div>
          <div className="rounded-sm border border-chrome-line-subtle p-3">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
              neutral — rejected
            </p>
            <p className="text-[13px] text-chrome-text-primary">Product data your GTM team can trust.</p>
            <p className="mt-1 text-[12px] text-chrome-text-muted-strong">
              Skene sits between Growth, Marketing, and Engineering.
            </p>
            <p className="mt-1 text-[12px] text-chrome-text-muted-weak">
              It finds gaps in product tracking before they corrupt dashboards.
            </p>
            <p className="mt-2 font-mono text-[9px] text-chrome-text-muted">7.04:1 · fades #ffffff</p>
          </div>
        </div>
      </div>

      {/* B. Why the line tokens are alpha and not an opaque border colour. */}
      <div className="rounded-md border border-chrome-line-subtle bg-chrome-surface-1 p-4">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
          chrome.line.* — alpha, not opaque
        </p>
        <p className="mb-4 text-[12px] text-chrome-text-muted">
          One border value over four grounds. The alpha rule holds its weight on
          every one; an opaque token is correct on exactly the ground it was
          picked against.
        </p>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            ['surface-0', 'bg-chrome-surface-0'],
            ['surface-1', 'bg-chrome-surface-1'],
            ['deep', 'bg-chrome-surface-deep'],
            ['surface-2', 'bg-chrome-surface-2'],
          ].map(([label, bg]) => (
            <div key={label} className={`rounded-sm p-3 ${bg}`}>
              <p className="mb-2 font-mono text-[9px] text-chrome-text-muted">{label}</p>
              <div className="border-t border-chrome-line-subtle pt-2 text-[11px] text-chrome-text-muted-warm">
                subtle
              </div>
              <div className="mt-2 border-t border-chrome-line-strong pt-2 text-[11px] text-chrome-text-muted-warm">
                strong
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-sm bg-brand-peach p-3">
          <p className="mb-2 font-mono text-[9px] text-chrome-surface-0">on a peach fill</p>
          <div className="border-t border-chrome-line-on-light pt-2 text-[11px] text-chrome-surface-0">
            line.onLight — the inverted case
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* C. The two accents, in the job they were promoted for. */}
        <div className="rounded-md border border-chrome-line-subtle bg-chrome-surface-1 p-4">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
            accent.* — feature-row tints
          </p>
          <p className="mb-4 text-[12px] text-chrome-text-muted">
            Three rows that need telling apart. Nearest existing token was ΔE 24+.
          </p>
          <div className="space-y-2">
            {[
              ['Audit the gaps', 'bg-brand-peach', 'brand.peach'],
              ['Protect the signal', 'bg-accent-violet', 'accent.violet'],
              ['Improve the journey', 'bg-accent-blue', 'accent.blue'],
            ].map(([label, bg, token]) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`size-8 shrink-0 rounded-sm ${bg}`} />
                <span className="text-[13px] text-chrome-text-primary">{label}</span>
                <span className="ml-auto font-mono text-[9px] text-chrome-text-muted">{token}</span>
              </div>
            ))}
          </div>
        </div>

        {/* D. The rungs the dashboard ladder never had. */}
        <div className="rounded-md border border-chrome-line-subtle bg-chrome-surface-1 p-4">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-chrome-text-muted">
            radius.2xl / 3xl — marketing rungs
          </p>
          <p className="mb-4 text-[12px] text-chrome-text-muted">
            The ladder stopped at xl (12px) because it was drawn for dense chrome.
            Marketing cards are visibly rounder and had been hardcoding both.
          </p>
          <div className="flex items-end gap-3">
            {[
              ['xl', '12px', 'rounded-xl'],
              ['2xl', '16px', 'rounded-2xl'],
              ['3xl', '24px', 'rounded-3xl'],
            ].map(([name, px, cls]) => (
              <div key={name} className="text-center">
                <div className={`size-20 border border-chrome-line-strong bg-chrome-surface-2 ${cls}`} />
                <p className="mt-2 font-mono text-[10px] text-chrome-text-primary">{name}</p>
                <p className="font-mono text-[9px] text-chrome-text-muted">{px}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-chrome-text-muted">
            Utilities above are Tailwind&rsquo;s own. The whole{' '}
            <code className="text-[10px]">radius.*</code> group is excluded from{' '}
            <code className="text-[10px]">@theme inline</code> on purpose — it would
            collide with the shadcn calc ladder — so these tokens record the values
            rather than drive them. Both happen to agree exactly.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Section 2 of the captured demo — "Your dashboards keep updating. That doesn't
 * mean the data is right." — rebuilt entirely from package parts.
 *
 * This is the acceptance test for Stage 2. The capture needed 173 hand-written
 * classes for the page it came from; this band needs none. If it cannot be built
 * from what ships here, the gap is visible rather than argued about.
 */
function SectionParts() {
  return (
    <FeatureStack>
      <FeatureRow
        n="01"
        icon={<FeatureIcon accent="peach">◎</FeatureIcon>}
        title="Your dashboards keep updating. That doesn't mean the data is right."
        actions={<Button variant="outline" size="sm">Run a free data audit</Button>}
        visual={
          <ProductWindow
            title="Activation funnel · Last 28 days"
            status={<WindowStatus>Dashboard: healthy</WindowStatus>}
          >
            <MetricCard label="Trial activation" value="31.4%" delta="↓ 8.2%" trend="danger">
              <Sparkline bars={[74, 81, 77, 72, 55, 51, 47, 45]} highlight={4} />
            </MetricCard>
            <div className="grid gap-2 px-[18px] pb-[18px]">
              <Finding status="good" tag="01" title="Signed up" note="Event verified" />
              <Finding
                status="warn"
                tag="02"
                title="Invited team"
                note="Field renamed in release 184"
              />
              <Finding status="danger" tag="03" title="First value" note="Not measured" />
            </div>
          </ProductWindow>
        }
      >
        <p>
          Product updates quietly rename events, remove fields, and change when tracking fires.
          Important journey steps may never have been measured at all.
        </p>
      </FeatureRow>

      <FeatureRow
        reverse
        n="02"
        icon={<FeatureIcon accent="violet">◈</FeatureIcon>}
        title="Catch the break before it reaches the dashboard."
        visual={
          <ProductWindow
            tone="dark"
            title="skene · tracking plan"
            status={<WindowStatus tone="live">Live</WindowStatus>}
          >
            <WindowToolbar>
              <div className="flex items-center gap-2.5 font-mono text-[11px]">
                main → release/184
              </div>
              <WindowChip>42 matched</WindowChip>
            </WindowToolbar>
            <div className="grid gap-2 p-[18px]">
              <Finding
                onLight={false}
                status="danger"
                tag="diff"
                title="checkout_started renamed"
                note="3 call sites stale"
              />
              <Finding
                onLight={false}
                status="good"
                tag="ok"
                title="plan_upgraded unchanged"
                note="Verified against the plan"
              />
            </div>
          </ProductWindow>
        }
      >
        <p>
          The same three states, the same three colours, whether they render on a marketing page
          or inside the product.
        </p>
      </FeatureRow>
    </FeatureStack>
  )
}

/** A themed frame, so each surface can be judged on a light and a dark page. */
function Mode({ mode, children }: { mode: 'light' | 'dark'; children: React.ReactNode }) {
  return (
    <div className={mode}>
      <div className="rounded-lg border border-border bg-background p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {mode} page
        </p>
        {children}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <header>
        <h1 className="text-3xl">Skene design system</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          One package, two surfaces. Everything below is imported from{' '}
          <code className="text-xs">@skene/design-system</code>; nothing is
          defined in this app. Its entire stylesheet is two{' '}
          <code className="text-xs">@import</code> lines, so if a primitive
          renders unstyled here, the package is broken rather than the page.
        </p>
        <p className="mt-4 text-sm">
          <a href="/surfaces" className="text-primary underline underline-offset-4">
            See page compositions &rarr;
          </a>{' '}
          <span className="text-muted-foreground">
            what a page built from this actually looks like on each surface.
          </span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">30 primitives</Badge>
          <Badge variant="outline">193 tokens</Badge>
          <Badge variant="outline">39 shadcn slots</Badge>
        </div>
      </header>

      <Section
        n="01"
        title="Shared primitives"
        note="Identical on both surfaces. Sharing these is what removes the three drifted copies that existed before."
      >
        <Primitives />
      </Section>

      <Section
        n="02"
        title="Dashboard surface — fixed chrome"
        note="chrome.* is invariant. A panel stays dark whether the page around it is light or dark, which is what the dashboard means by a surface."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Mode mode="light">
            <ChromeSurface />
          </Mode>
          <Mode mode="dark">
            <ChromeSurface />
          </Mode>
        </div>
      </Section>

      <Section
        n="03"
        title="Marketing surface — theme-aware"
        note="surface.* carries a mode map and inverts to zinc in light. Same component, opposite behaviour. The two roles are identical in dark and diverge only in light, which is why one set of names covered both for so long."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Mode mode="light">
            <ThemedSurface />
          </Mode>
          <Mode mode="dark">
            <ThemedSurface />
          </Mode>
        </div>
      </Section>

      <Section
        n="04"
        title="New in 2.6.0 — the marketing ladder"
        note="Nine tokens reconciled out of the Stand demo capture, shown as the decisions they encode. Fixed-dark on purpose: these have no designed light value, and roles.test.ts asserts they never gain one silently."
      >
        <NewTokens />
      </Section>

      <Section
        n="05"
        title="Sections — a captured page band, rebuilt from parts"
        note="Section 2 of the Stand demo. The capture needed 173 hand-written classes for the page it came from; this band needs none. Stage 2 of the extraction."
      >
        <SectionParts />
      </Section>

      <Section
        n="06"
        title="Pricing, closing band, footer"
        note="Stage 3. The featured plan card is cream on a dark page — the same inversion as ProductWindow tone=light, and it carries the same `light` class for the same reason. The captured demo had hand-darkened its check mark to #a86636 to cope; the class makes that automatic."
      >
        <div className="space-y-8">
          <PricingDemo />
          <FinalCta
            lede="A renamed event passes every test, ships green, and sits broken for weeks before anyone notices."
            actions={
              <>
                <Button>Start free</Button>
                <Button variant="outline">Install Skene</Button>
              </>
            }
          >
            Patch the code tomorrow. The data from this week is already gone.
          </FinalCta>
          <SiteFooter
            wordmark="Skene"
            copyright="© 2026 Skene. All rights reserved."
            legal="Privacy Policy"
            brand={
              <div>
                <span className="text-[15px] text-chrome-text-primary">Skene</span>
                <p className="mt-5 max-w-[250px] text-[14px] text-chrome-text-muted-warm">
                  Product analytics in your own Supabase, checked on every pull request.
                </p>
                <SocialLinks>
                  <SocialLink href="#" label="LinkedIn">in</SocialLink>
                  <SocialLink href="#" label="GitHub">gh</SocialLink>
                </SocialLinks>
              </div>
            }
          >
            {[
              ['Product', ['How it works', 'Features', 'Supabase', 'Architecture', 'Pricing']],
              ['Resources', ['Documentation', 'Glossary', 'Playbooks', 'Blog']],
              ['Company', ['About', 'Open source', 'Contact', 'Privacy', 'Terms']],
            ].map(([title, links]) => (
              <FooterColumn key={title as string} title={title as string}>
                {(links as string[]).map((l) => (
                  <FooterLink key={l} href="#">{l}</FooterLink>
                ))}
              </FooterColumn>
            ))}
          </SiteFooter>
        </div>
      </Section>

      <Section
        n="07"
        title="Composition"
        note="Primitives on each surface, to check they read correctly against both ladders."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Mode mode="light">
            <Card>
              <CardHeader>
                <CardTitle>Tracking plan</CardTitle>
                <CardDescription>Three events changed on this branch.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {['checkout_started', 'plan_upgraded'].map((e, i) => (
                      <TableRow key={e}>
                        <TableCell>{e}</TableCell>
                        <TableCell className="text-right">{(i + 1) * 2568}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Mode>
          <Mode mode="dark">
            <Card>
              <CardHeader>
                <CardTitle>Tracking plan</CardTitle>
                <CardDescription>Three events changed on this branch.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="outline">
                    Review diff
                  </Button>
                  <Badge variant="secondary">2 breaking</Badge>
                </div>
              </CardContent>
            </Card>
          </Mode>
        </div>
      </Section>
    </main>
  )
}
