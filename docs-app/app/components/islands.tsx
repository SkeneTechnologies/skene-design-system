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
 * Driving the toggle through a real interaction on mount is therefore not a
 * trick played on the component, it is the component's own contract, and it
 * pins the view as a side effect of the thing that was needed anyway.
 *
 * THIS USED TO BE ONE `.click()` ON A `<button>` MATCHING `view` BY TEXT, AND
 * IT NEVER WORKED FOR "Engineering" — every case pinning "GTM" rendered
 * correctly by pure coincidence, because "GTM" is the scene's own default and
 * the pin was, in full, a no-op. Three independent reasons stacked, each found
 * empirically (a debug script driving the real component in a real browser,
 * not read off the markup) rather than assumed from one plausible-looking bug:
 *
 *   The trigger needs `pointerdown`, not `click`, to open. Radix's own
 *   `DropdownMenuTrigger` opens on `onPointerDown` — checked in
 *   `@radix-ui/react-dropdown-menu`'s source, `event.button === 0 &&
 *   event.ctrlKey === false` — specifically so press-and-drag-to-select works;
 *   it does not listen for `click` at all. `HTMLElement.click()` dispatches
 *   exactly one `click` event and nothing else, so the ORIGINAL code's click
 *   never opened the menu in the first place, independent of everything below.
 *
 *   Scope. The radio items live in a Radix `DropdownMenuPrimitive.Portal`,
 *   which renders into `document.body`, not into this component's own
 *   subtree. Searching `root` — this wrapper's own ref — for the target was
 *   searching a subtree the target is never in, portal or no portal.
 *
 *   Element type. A Radix `DropdownMenuRadioItem` is not a `<button>`. It
 *   renders `role="menuitemradio"`, so a `querySelectorAll('button')`
 *   excludes it by construction even when scoped correctly.
 *
 * The trigger IS a `<button>`, but its own text is "View" + the CURRENT label
 * concatenated ("ViewGTM"/"ViewEngineering"), never "GTM" or "Engineering"
 * alone, so a correctly-scoped `button` search still would not have matched it
 * against `view` — it is never the thing whose text should equal the target.
 *
 * The fix: dispatch a `PointerEvent('pointerdown', { button: 0, ctrlKey:
 * false })` at the trigger — verified against Radix's own gate above, not
 * guessed — then wait for the portalled item with matching text to exist and
 * `.click()` THAT. `.click()` is correct for the item itself: the underlying
 * `MenuItem` primitive selects on `onClick`, composed with its `onSelect`
 * handler, so only the trigger needed the pointer event.
 *
 * The wait is a `MutationObserver` on `document.body`, not a fixed delay: the
 * portal does not exist synchronously after the pointerdown, Radix mounts it
 * on a later commit. The spec that consumes this pinning already budgets a
 * scroll pass, up to 15s of `networkidle`, and a 150ms settle before any
 * capture — far more than the portal needs — but a real observer is correct
 * regardless of how generous that budget is, and does not silently start
 * passing again if the budget is ever tightened.
 *
 * See the Engineering case's own comment in ../components/page.tsx for what
 * its baseline actually shows now that this runs for real, for the first time.
 *
 * `light` on the wrapper is GONE as of the module's `applies-dark` fix, and
 * this doc comment used to justify keeping it: "The module is
 * `polarity: inherits`... its tokens alias to `--color-text-primary`... without
 * a `light` ancestor it renders near-white ink on its own white cards." Neither
 * clause is true of the current, CSS-rewritten component. `--color-text-primary`
 * is not read anywhere in journey-signal-scene.css or .tsx any more — the
 * scene's card-side ink is `--color-text-light`/`--color-text-dark`, locally
 * scoped fixed hex literals declared on the module's own root, unaffected by
 * any ancestor theme class. And the module now puts `dark` on its own root
 * (`polarity: applies-dark`), so it no longer depends on an ancestor for
 * anything.
 *
 * `light` was therefore not a compensating fix, it was fighting the module's
 * one deliberate rule: `.jss-frame` in the stylesheet is transparent by
 * founder direction 2026-08-26, specifically so "the hero's halftone field
 * runs under the panels and they read as floating on it instead." Wrapping the
 * scene in `bg-brand-light` painted a solid cream card behind the whole thing,
 * which is the opposite of floating — every gallery baseline taken with this
 * wrapper in place has the scene sitting on a cream rectangle no page has ever
 * actually shown it on. The page's own case now supplies the dark ground (see
 * `Chrome` in ../components/page.tsx); this wrapper supplies none, on purpose.
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

    const trigger = root.querySelector<HTMLButtonElement>('button')
    if (!trigger) return

    /*
     * Scoped to THIS trigger's own portalled content via `aria-controls`,
     * which Radix sets on the trigger to the content's `id` once open — NOT
     * scoped by matching text globally across `document`. Two scenes both
     * pinning a view mount on the same page (the WIDE + MEDIUM cases below),
     * both dispatch a pointerdown around the same tick, and Radix opens both
     * menus. `document.querySelectorAll('[role="menuitemradio"]')` at that
     * point returns four items from two different menus, and `.find()` by
     * text alone has no way to tell which "GTM" or which "Engineering"
     * belongs to which trigger — the first version of this fix picked
     * whichever matched first in DOM order, which is not necessarily this
     * instance's own item. Verified as the actual failure, not a theoretical
     * one: with the global-text version, the WIDE case pinned onto
     * "Engineering" and the MEDIUM case pinned onto "GTM" — the two swapped —
     * and one menu was left open on the page after both effects settled.
     */
    const findOwnOption = () => {
      const controlsId = trigger.getAttribute('aria-controls')
      if (!controlsId) return null
      const content = document.getElementById(controlsId)
      if (!content) return null
      return Array.from(content.querySelectorAll<HTMLElement>('[role="menuitemradio"]')).find(
        (el) => el.textContent?.trim() === view,
      )
    }

    // Already open and rendered — some future markup change, not today's.
    const existing = findOwnOption()
    if (existing) {
      existing.click()
      return
    }

    // NOT `trigger.click()`. Radix's `DropdownMenuTrigger` opens on
    // `onPointerDown` (`event.button === 0 && event.ctrlKey === false`), not
    // `onClick`, so a plain `.click()` dispatches an event the trigger never
    // listens for and the menu never opens. See the block comment above.
    trigger.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ctrlKey: false,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    )

    let settled = false
    const observer = new MutationObserver(() => {
      const option = findOwnOption()
      if (!option) return
      settled = true
      observer.disconnect()
      option.click()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // The portal mounts within one or two commits of the pointerdown above;
    // this timeout is a backstop against a markup change breaking the match
    // silently, not the expected path. If it fires, `view` never got pinned
    // and the scene is back to auto-advancing, which is loud (the frame
    // moves) rather than quiet.
    const giveUp = window.setTimeout(() => {
      if (!settled) observer.disconnect()
    }, 2000)

    return () => {
      observer.disconnect()
      window.clearTimeout(giveUp)
    }
  }, [view])
  return (
    <div className={`rounded-md ${width}`} ref={ref}>
      {children}
    </div>
  )
}
