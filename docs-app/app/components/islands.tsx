'use client'

import { useEffect, useRef, useState } from 'react'

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

/*
 * `FrozenGsap` lived here until 2026-09-02: it disabled every ScrollTrigger on
 * the page and seeked each gsap timeline to a chosen playhead, because a
 * cycling timeline never gives `toHaveScreenshot` two identical frames. The
 * package has no gsap now. `CardAnimationIntegrations` takes a `frame` prop
 * that holds one resting state, and the journey scene's entry reveal is a CSS
 * transition, which Playwright's `animations: 'disabled'` finishes for it.
 */

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
