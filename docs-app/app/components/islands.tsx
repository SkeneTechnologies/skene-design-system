'use client'

import { useEffect, useState } from 'react'
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

export function FrozenGsap({ seconds }: { seconds: number }) {
  useEffect(() => {
    let frames = 0
    let raf = 0
    const tick = () => {
      ScrollTrigger.getAll().forEach((st) => st.disable(false, true))
      for (const child of gsap.globalTimeline.getChildren(false, false, true)) {
        if (HELD.has(child)) continue
        HELD.add(child)
        child.pause(0)
        child.seek(seconds, false)
      }
      if (++frames < 30) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seconds])
  return null
}
