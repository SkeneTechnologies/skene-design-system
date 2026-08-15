import { Button } from '@skene/design-system/ui/button'
import { FinalCta } from '@skene/design-system/sections/final-cta'
import {
  SiteFooter, FooterColumn, FooterLink, SocialLinks, SocialLink,
} from '@skene/design-system/sections/footer'
import { FeatureRow, FeatureIcon } from '@skene/design-system/sections/feature-row'
import {
  ProductWindow, WindowStatus, WindowToolbar, WindowChip,
} from '@skene/design-system/sections/product-window'
import { Finding, MetricCard, Sparkline } from '@skene/design-system/sections/finding-card'
import { CheckList, CheckItem } from '@skene/design-system/sections/check-list'
import { PricingDemo } from '../pricing-demo'
import { Stage4 } from './stage4'

/**
 * Stage 3 on its own route.
 *
 * The index page is past 6,000px and the screenshot pipeline returns black
 * frames below roughly 3,000px of scroll, so a section added at the bottom of it
 * cannot be reviewed by eye — only by hit-testing the DOM. A short route is the
 * difference between "the tokens resolve" and "this looks right", and the light
 * plan card is exactly the kind of thing that has to be looked at.
 */
export default function SectionsPage() {
  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl">Sections</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Stage 3. The featured plan card is cream on a dark page and carries the{' '}
          <code className="text-xs">light</code> class — every mode-aware token inside it
          would otherwise resolve to its dark value against the fill.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 pb-12">
        <FeatureRow
          n="01"
          texture="journey"
          icon={<FeatureIcon accent="peach">◎</FeatureIcon>}
          title="Analytics live in your own Supabase."
          lede="Connect once. Skene adds the tracking you're missing, right into the database you already own."
          actions={<Button>Start free</Button>}
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
                <Finding status="warn" tag="02" title="Invited team" note="Field renamed in release 184" />
                <Finding status="danger" tag="03" title="First value" note="Not measured" />
              </div>
            </ProductWindow>
          }
        >
          <CheckList>
            <CheckItem>Connect your repo and Supabase, read-only</CheckItem>
            <CheckItem>Adds the events you&rsquo;re missing, indexed against your schema</CheckItem>
            <CheckItem>Your data stays in Supabase, never moved or copied</CheckItem>
            <CheckItem>Checks each PR against its preview branch</CheckItem>
          </CheckList>
        </FeatureRow>

        <FeatureRow
          reverse
          n="02"
          texture="github"
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
            The same three states, the same three colours, whether they render on a marketing
            page or inside the product.
          </p>
        </FeatureRow>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <PricingDemo />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <Stage4 />
      </div>

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
          ['Product', ['How it works', 'Features', 'Supabase', 'Pricing']],
          ['Resources', ['Documentation', 'Glossary', 'Blog']],
          ['Company', ['About', 'Open source', 'Contact', 'Terms']],
        ].map(([title, links]) => (
          <FooterColumn key={title as string} title={title as string}>
            {(links as string[]).map((l) => (
              <FooterLink key={l} href="#">{l}</FooterLink>
            ))}
          </FooterColumn>
        ))}
      </SiteFooter>
    </main>
  )
}
