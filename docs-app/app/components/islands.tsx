'use client'

import { useEffect, useState } from 'react'

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
      placeholder="For example: Next.js, Supabase, GitHub Actions, PostHog"
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
