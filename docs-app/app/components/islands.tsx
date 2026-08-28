'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { AskWidget } from '@skene/design-system/sections/ask-widget'
import { BillingToggle } from '@skene/design-system/sections/billing-toggle'

/**
 * A gallery case that cannot be a server component — `BillingToggle` owns no
 * state of its own, so the case has to.
 *
 * Kept out of page.tsx rather than marking the whole page `use client`: the
 * gallery's job is to render the package the way a consumer does, and a
 * consumer's marketing page is an RSC. A directive at the top of page.tsx would
 * quietly convert every primitive on it to a client component and the snapshots
 * would stop testing the server path.
 */
export function BillingToggleCase() {
  const [yearly, setYearly] = useState(false)
  return (
    <div className="space-y-4">
      <BillingToggle yearly={yearly} onChange={setYearly} />
      {/* Both positions, so the snapshot covers the "on" track colour too. The
          stateful one above is the same component with the opposite value. */}
      <BillingToggle yearly onChange={() => {}} />
    </div>
  )
}

/**
 * The other case that cannot be a server component, for the same reason and no
 * more: `AskWidget` is controlled, so somebody has to own the text, and an
 * owner of state is a client component. It lives here rather than pulling a
 * `use client` over page.tsx, which would quietly move every other case off the
 * server path the snapshots exist to test.
 *
 * The value starts empty on purpose. Empty renders the placeholder token and
 * filled renders the value token; they are different tokens, and the empty one
 * is what a first-time reader actually sees. `onSubmit` is left off entirely —
 * the widget already prevents the default, and this case has nothing to submit
 * to.
 */
export function AskWidgetCase() {
  const [value, setValue] = useState('')
  return (
    <AskWidget
      avatar="T"
      name="Teemu"
      question="Would Skene work with your stack?"
      lede="Name your tools. We'll show what Skene can check, how it connects, and where it won't fit."
      placeholder="For example: Next.js, Supabase, Vercel, PostHog"
      submitLabel="Check my setup"
      value={value}
      onValueChange={setValue}
    />
  )
}

/**
 * Re-apply the URL hash once the page has finished loading.
 *
 * /decisions deep-links here per component. The browser's own anchor scroll
 * fires before the section textures decode, and this page grows by ~8,000px as
 * they do — so the native jump lands on whatever happens to occupy that offset
 * at the time. Measured: #section-plan-card sits at y=9699 after load and the
 * browser had stopped at 1677.
 *
 * `load` rather than an effect alone, because the effect runs at hydration when
 * the images are still in flight. Only acts when a hash is present, so it
 * changes nothing for a normal visit — including the visual suite, which never
 * navigates with one.
 */
export function HashScroll() {
  useEffect(() => {
    if (!location.hash) return
    const go = () => {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      el?.scrollIntoView({ block: 'start' })
    }
    go()
    window.addEventListener('load', go)
    return () => window.removeEventListener('load', go)
  }, [])
  return null
}

/**
 * Pin every GSAP timeline on the page at one fixed playhead, so an animated
 * module can hold a baseline at all.
 *
 * `FREEZE_CSS` and Playwright's `animations: 'disabled'` between them cover CSS
 * animations, CSS transitions and the Web Animations API. They do not reach
 * GSAP, which drives inline styles off its own `requestAnimationFrame` ticker,
 * and two modules in this package are GSAP-driven:
 * `sections/card-animation-integrations` (a `repeat: -1` timeline that cycles
 * four detail panels and then fades the whole scene out) and
 * `sections/journey-signal-scene` (a finite entry timeline). Without this,
 * capture lands on whatever frame the ticker happened to be on, and
 * `toHaveScreenshot`'s stabilisation never gets two identical frames, so the
 * case does not flake quietly — it times out. That is the better failure, but
 * it is still not a baseline.
 *
 * Three things have to happen, and each one is load-bearing:
 *
 * 1. **Disable the ScrollTriggers, do not kill them.** `ScrollTrigger.kill()`
 *    kills the animation with the trigger unless `allowAnimation` is passed,
 *    which would leave the cards at `autoAlpha: 0` — a blank frame that passes.
 *    `disable(false, true)` leaves the timeline intact and stops the trigger
 *    resuming it, which it otherwise does on the `scrollIntoViewIfNeeded` the
 *    spec runs immediately before every capture.
 * 2. **Seek from 0 with events live.** The integrations timeline advances its
 *    active card through `.call(() => setActiveIdx(n))`, so a playhead moved
 *    with events suppressed renders geometry with no active card. `pause(0)`
 *    first (suppressed, so a backwards jump fires nothing), then
 *    `seek(seconds, false)` forwards through the callbacks in order.
 * 3. **Keep trying for half a second.** A timeline created in a module's own
 *    mount effect exists before this component's effect runs, but ScrollTrigger
 *    refreshes on later frames and a module may create one then. A `WeakSet`
 *    makes the retry idempotent: a timeline is held once and never re-seeked.
 *
 * `gsap` is imported here WITHOUT being declared in docs-app/package.json, and
 * that is deliberate. Node resolution walks up from docs-app to the package
 * root's `node_modules/gsap`, which is the same copy `dist/sections/*.js`
 * resolves — one module instance, one `globalTimeline`. Adding the dependency
 * would install a second copy under docs-app, `ScrollTrigger.getAll()` would
 * return an empty list against timelines it cannot see, and this freeze would
 * silently no-op.
 */
const HELD = new WeakSet<object>()

/**
 * Which case a timeline belongs to, worked out from what it animates.
 *
 * There is one `gsap.globalTimeline` for the page, so a per-case playhead needs
 * a way to tell one module's timeline from another's. The timeline itself
 * carries no marker, but its tweens carry their targets, so the scope is
 * whichever case element contains them. Nested children too (`getChildren(true,
 * true, false)`), because both animated modules build their timelines out of
 * `.to()` calls on element sets rather than out of sub-timelines.
 */
function scopeOf(timeline: gsap.core.Timeline, selectors: string[]): string | null {
  const targets = timeline
    .getChildren(true, true, false)
    .flatMap((t) => (t as gsap.core.Tween).targets<unknown>())
    .filter((t): t is Node => t instanceof Node)
  for (const selector of selectors) {
    const root = document.querySelector(selector)
    if (root && targets.some((t) => root.contains(t))) return selector
  }
  return null
}

export function FrozenGsap({
  seconds,
  at = [],
}: {
  /** Playhead for every timeline that no `at` entry claims. */
  seconds: number
  /**
   * Per-case playheads: `{ selector, seconds }`, where the selector is a case
   * element. Needed because one frame proves one state, so a module that cycles
   * gets a second case at a second playhead rather than a second copy of the
   * first. Matched against a selector rather than a wrapper element on purpose
   * — a wrapper would change the DOM of the cases that already have baselines.
   */
  at?: { selector: string; seconds: number }[]
}) {
  useEffect(() => {
    let frames = 0
    let raf = 0
    const selectors = at.map((a) => a.selector)
    const tick = () => {
      ScrollTrigger.getAll().forEach((st) => st.disable(false, true))
      for (const child of gsap.globalTimeline.getChildren(false, false, true)) {
        if (HELD.has(child)) continue
        const scope = scopeOf(child as gsap.core.Timeline, selectors)
        const at_ = at.find((a) => a.selector === scope)
        HELD.add(child)
        child.pause(0)
        child.seek(at_ ? at_.seconds : seconds, false)
      }
      if (++frames < 30) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // AND THEN FOREVER, every 100ms, which is not belt-and-braces.
    //
    // The frame loop above only covers timelines that exist within about half a
    // second of this component hydrating, and that assumption failed under
    // load: one `components — light` run took 1.1 minutes and lost
    // `section-card-animation-integrations` — no actual image and no diff, just
    // a capture that never stabilised, which is what a live GSAP loop looks
    // like from `toHaveScreenshot`. The animated modules are client components
    // behind their own chunks (`gsap` is a large one), so on a slow worker they
    // can hydrate, and build their timelines, well after this component has
    // stopped watching, and a timeline created after the last frame escapes the
    // freeze entirely.
    //
    // An interval with no end catches one within 100ms of its creation for as
    // long as the page is open. `HELD` keeps it idempotent, so this is a
    // no-op every tick once everything is pinned, and pinning late is harmless:
    // `pause(0)` then `seek()` lands on the same deterministic state wherever
    // the playhead had got to.
    const interval = window.setInterval(tick, 100)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, JSON.stringify(at)])
  return null
}

/**
 * `JourneySignalScene` with its view pinned, because otherwise it changes on
 * its own halfway through a capture.
 *
 * The scene auto-advances between its GTM and Engineering views every 6s while
 * an IntersectionObserver says it is on screen, and the spec scrolls each case
 * into view immediately before capturing it. So the view at capture time is
 * whatever the clock says, which is not a baseline. There is no `view` prop —
 * the module's own words are that content "lives in named consts near the top
 * of the source file" — but there IS a documented handover: the scene stops
 * advancing "for good the moment someone reaches for the toggle themselves".
 * Clicking the toggle once on mount is therefore not a trick played on the
 * component, it is the component's own contract, and it pins the view as a side
 * effect of the thing that was needed anyway.
 *
 * `HTMLElement.click()` rather than a real pointer: it dispatches the click
 * without moving focus, so no focus ring lands in the frame.
 *
 * `light` on the wrapper is not decoration. The module is `polarity: inherits`
 * and its own `watchFor` says its tokens alias to `--color-text-primary`, which
 * defaults to the DARK reading, while every card in the scene paints a
 * white/cream background regardless of page theme. Without a `light` ancestor
 * it renders near-white ink on its own white cards.
 */
export function JourneySceneCase({
  view,
  width,
  children,
}: {
  view: 'GTM' | 'Engineering'
  /** Width class for the measured container — this scene picks a layout from it. */
  width: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const button = Array.from(root.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === view,
    )
    button?.click()
  }, [view])
  return (
    <div className={`light rounded-md bg-brand-light ${width}`} ref={ref}>
      {children}
    </div>
  )
}
