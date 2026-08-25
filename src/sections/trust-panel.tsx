import { cn } from '../lib/utils.js'
import { GlyphBadge } from './glyph-badge.js'

/**
 * The trust panel: a cream card split in two — the claim on the left, the facts
 * that back it on the right.
 *
 * The split is the argument. Copy and links on one side, a stack of concrete,
 * checkable facts on the other, so the reassurance is not a paragraph asserting
 * itself but a paragraph next to its evidence. The evidence column is the wider
 * of the two (`0.9fr 1.1fr`) for the same reason: the facts are the payload.
 *
 * ## The nested inversion
 *
 * This is a CREAM panel on a dark page, so the root carries `light` for the same
 * reason `LightSectionCard`, `Bridge`, `ProductWindow tone="light"` and the
 * featured `PlanCard` do: without it every mode-aware token in the subtree keeps
 * its DARK value against a cream fill — `text.primary` resolves to #faf1e9 on
 * #faf1e9, which is not dim, it is absent. The class is unconditional, and it is
 * first in the class list so it reads as structure rather than decoration.
 *
 * Which is also why nothing here uses `chrome.text.*`. Those are invariant by
 * definition — they cannot follow the class — so they are correct only on a
 * surface that is always dark, and this one never is. Every piece of type uses
 * the theme-aware `text.*` role. The hairlines are the deliberate exception:
 * `chrome.line.onLight` is the dark rule designed for a cream fill, and no
 * mode-aware role covers it.
 *
 * ## Why the facts panel is a DEEPER CREAM and not a grey
 *
 * The captured design puts the facts on `#e6dbd1` — a second, lower tone of the
 * same cream. That choice is load-bearing and easy to lose in a rebuild, because
 * "slightly darker panel" reads to a developer as "grey", and `surface.1` is
 * right there. It is the wrong answer. A grey panel introduces a second material:
 * the card stops being one card with a shaded half and becomes two objects that
 * happen to touch, and the seam between them reads as a join rather than a fold.
 * A deeper cream reads as the same surface, shaded — one card, one paper, one
 * light source.
 *
 * So the tone is derived rather than pasted: `brand.light` mixed toward
 * `brand.bronze`, which lands within a couple of steps of the captured
 * `#e6dbd1` while staying, by construction, a shade of the cream token. Change
 * the cream and the shade follows it, which a hex could not do — and
 * `machine/rules.yaml` forbids the hex anyway (`must_not:
 * arbitrary_hex_in_classnames`, `must: use_tokens_over_literal_values`).
 *
 * ## The glow
 *
 * The peach bloom rises from the BOTTOM-LEFT corner and dies at 65%, so it warms
 * the corner the eye enters from and leaves the facts column clean. It is drawn
 * from `brand.peach` through `color-mix`, not from a literal. Note what `light`
 * does to it: inside this panel `brand.peach` resolves to its light value
 * (#89684a), not the dark-page #fec089 — and that IS the value designed to sit
 * on cream. The captured demo discovered it by hand and pasted a one-off
 * `#a86636` in this exact spot; through the token every instance gets it for
 * free. It is decoration for a mood the copy already sets, so it is `aria-hidden`
 * and behind the content rather than over it.
 *
 * ## Layout
 *
 * One column below `md` (768px), where the two-column split would give both
 * halves less room than either needs. The 58px padding goes with it — 58px of
 * inset on a 360px screen is a column of confetti — so it drops to a phone-sized
 * inset below `md` and takes the captured value from there up.
 *
 * The two-track template is conditional on `children` for the same reason
 * `LightSectionCard` conditions its tracks on `visual`: the facts column is a
 * slot, and a template that declares a track the markup never fills leaves the
 * copy crushed into `0.9fr` beside a blank `1.1fr` of cream — more than half the
 * card empty. No facts, one track.
 *
 * All content is props: no section copy, no link text, no fact lives in here.
 * No `use client` — everything is props in, markup out.
 */

export interface TrustFactProps {
  /**
   * Glyph for the 38px circle — a `GlyphBadge` at its defaults. Optional: the
   * circle still renders, keeping the title's left edge aligned across a stack
   * where only some facts have one. The disc is not resizable from here; a row
   * that wants a smaller one wants `GlyphBadge` directly, which is why it is a
   * separate export.
   */
  icon?: React.ReactNode
  /** The fact itself, stated flat. This is the line a reader scans. */
  title: React.ReactNode
  /** The qualifier under it — scope, limit, or how it is verified. */
  children?: React.ReactNode
  /**
   * Which ground the fact sits on, in `GlyphBadge`'s vocabulary because the
   * two invariant pieces of chrome this row owns are exactly the badge's.
   *
   * `tint` — the default, and byte-for-byte what this row has always rendered
   * inside the cream panel: the `chrome.line.onLight` separating rule and the
   * badge at its `tint` tone. Both are invariant dark-on-cream chrome, which
   * is why a fact row lifted onto a dark band used to lose its rule and its
   * disc while the (theme-aware) type survived.
   *
   * `muted` — the theme-following pair for every other ground: the rule takes
   * `border` and the disc takes `GlyphBadge tone="muted"`, the same pairing
   * skene-site's events rows use on the dark page. The type needs no swap; it
   * was `text.*` all along.
   */
  tone?: 'tint' | 'muted'
  className?: string
}

export function TrustFact({ icon, title, children, tone = 'tint', className }: TrustFactProps) {
  return (
    // An `<li>`, not an `<article>`: a one-line fact plus its qualifier is not a
    // self-contained, independently distributable composition, and it has no
    // accessible name to be one with. The facts are a stack of peers, so list
    // semantics are the true ones — they are what gives a screen reader "3 of 5".
    // Its parent in `TrustPanel` is the `<ul>`.
    //
    // The rule belongs to the item, not to a divider element, so it can never
    // render with nothing under it; `last:` drops it on the final fact, which is
    // why the stack must not be padded by a parent `gap` as well.
    <li
      className={cn(
        'grid grid-cols-[40px_1fr] items-start gap-x-4 border-b py-[22px] first:pt-0 last:border-b-0 last:pb-0',
        // The rule follows `tone` — the on-light hairline is invariant chrome
        // and vanishes on a dark ground. See the prop.
        tone === 'muted' ? 'border-border' : 'border-chrome-line-on-light',
        className,
      )}
    >
      {/*
        The disc moved to `GlyphBadge` on 2026-08-14 and this composes it. Its
        defaults ARE these values — 38px, `tint`, the on-light hairline over a
        12% peach wash — so the row renders identically; the extraction exists
        because skene-site's events list needs the disc at 32px WITHOUT a fact
        row around it, and a `size` prop here could not have given it that.
      */}
      <GlyphBadge tone={tone} className="col-start-1 row-start-1">{icon}</GlyphBadge>

      {/*
        A plain `<span>`, not `<strong>`: `font-medium` already carries the
        weight, and marking every fact important marks none of them.
      */}
      <span className="col-start-2 row-start-1 self-center text-[15px] font-medium leading-snug text-text-primary">
        {title}
      </span>

      {children ? (
        <p className="col-start-2 row-start-2 mt-1.5 text-[13.5px] leading-relaxed text-text-muted">
          {children}
        </p>
      ) : null}
    </li>
  )
}

export interface TrustPanelProps {
  /**
   * The kicker above the heading — usually an `<Eyebrow>`.
   *
   * A slot, not a string, for the reason `links` gives: this band renders on
   * cream, where the invariant `chrome.*` colours `Eyebrow` ships with are
   * near-invisible, so the caller passes the chip with whatever override its
   * ground needs. See `Bridge`, which overrides exactly two utilities.
   *
   * Added 2026-08-14. Without it, adopting this component for a band that has
   * an eyebrow means dropping shipped copy — which is why two hand-rolled
   * bands on skene-site's homepage could not use it.
   */
  eyebrow?: React.ReactNode
  /** The claim, as a heading. */
  title: React.ReactNode
  /** One paragraph under it — the shape of the claim, not its proof. */
  lede?: React.ReactNode
  /**
   * A wrapped row of anchors under the lede. A slot rather than a href list
   * because these are usually a mix of internal routes and external policy
   * links, and the caller owns which component renders each.
   */
  links?: React.ReactNode
  /**
   * `TrustFact`s, in order. They draw their own separating rules, and they are
   * `<li>`s — this slot renders inside a `<ul>`, so pass facts, not arbitrary
   * markup. Omitting it collapses the panel to a single column.
   */
  children?: React.ReactNode
  className?: string
}

export function TrustPanel({ eyebrow, title, lede, links, children, className }: TrustPanelProps) {
  return (
    <section
      className={cn(
        // `light` first, and never conditional — see the file header.
        'light grid overflow-hidden rounded-[var(--radius-lg)] border border-chrome-line-on-light bg-brand-light',
        // The template follows the markup: two tracks only when the second one
        // is rendered. See the file header.
        children && 'md:grid-cols-[0.9fr_1.1fr]',
        className,
      )}
    >
      <div className="relative p-8 md:p-[58px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 0% 100%, color-mix(in oklab, var(--color-brand-peach) 20%, transparent) 0%, transparent 65%)',
          }}
        />

        {/* `relative` lifts the copy off the glow layer without a z-index race. */}
        <div className="relative">
          {/* Inside this block, not above it: the glow is `absolute inset-0`
              and only this wrapper is lifted off it. An eyebrow rendered
              outside would sit under the gradient at the panel's hottest
              corner. */}
          {eyebrow ? <div className="mb-5">{eyebrow}</div> : null}
          <h2 className="max-w-[440px] text-[clamp(1.9rem,2.8vw,2.75rem)] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary">
            {title}
          </h2>

          {lede ? (
            <p className="mt-4 max-w-[430px] text-[15px] leading-relaxed text-text-muted">{lede}</p>
          ) : null}

          {links ? (
            // Styling only — the anchors and their labels come from the caller.
            <div className="mt-[30px] flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-text-muted-strong [&_a:hover]:text-text-primary [&_a]:underline [&_a]:underline-offset-4">
              {links}
            </div>
          ) : null}
        </div>
      </div>

      {children ? (
        // `<ul>`, because the facts are a stack of peers and each `TrustFact` is
        // an `<li>`. It is this element rather than a wrapper inside it so the
        // list is not broken by `display: contents`, which several browsers
        // still strip list semantics from.
        <ul
          className="p-8 md:p-11"
          style={{
            // A deeper cream, not a grey — see the file header. Derived from the
            // cream token so it stays a shade of this surface rather than a
            // second material pinned to a hex.
            background: 'color-mix(in oklab, var(--color-brand-light) 84%, var(--color-brand-bronze))',
          }}
        >
          {children}
        </ul>
      ) : null}
    </section>
  )
}
