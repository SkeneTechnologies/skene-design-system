# Principles

**Scope:** every Skene surface — four repos, of which two install the package
today. `machine/rules.yaml` `consumers` is the canonical list and carries the
install status of each; this line went stale by omitting `skene-site`, which is
the largest consumer there is.

| repo | installs |
|---|---|
| `skene-site` | yes — the largest consumer |
| `skene-marketing-website` | yes |
| `skene-dashboard` | no — where the tokens came from, still on its own copies |
| the app serving `/login` and `/signup` | never audited |

This document previously said *"Do not implement landing or public-site pages in
this repo."* That was right while it lived in the dashboard. Here it was exactly
backwards, and it is the sort of stale instruction an agent will follow off a
cliff, so it is called out rather than quietly deleted.

## Why the package exists

The two apps had drifted into one design system split in half. The dashboard
owned `design-tokens.json` and the generators; the marketing site had no token
file at all, only a block in `globals.css` marked *"@generated … run
npm run tokens:css"* naming a script that did not exist in that repo. Its tokens
had been generated in the dashboard and pasted across by hand, and the pasting
had stopped. A value-level diff of the two stylesheets found 253 custom
properties: 127 agreed, 12 conflicted, and the rest existed on one side only.

## Order of reach

1. A primitive from `@skene/design-system/ui/*`
2. A pattern from `@skene/design-system/patterns/*`
3. A Tailwind utility generated from the package's `@theme inline`
4. A class from `@skene/design-system/effects.css`
5. App-local CSS — only for chrome that genuinely belongs to one app

If you find yourself at step 5 for anything reusable, stop and ask. That is how
three drifted copies of the shadcn set happened the first time.

## The two surface roles

The single most important thing to get right, because getting it wrong looks
correct until someone opens light mode.

| | `color.chrome.*` | `color.surface.*` / `color.text.*` |
|---|---|---|
| behaviour | invariant, always dark | mode-aware, inverts to zinc in light |
| use for | terminals, code blocks, log panels, data tables — anything that should stay dark on a light page | page surfaces that should follow the theme |

They share their dark values and diverge only in light, which is why one set of
names covered both for years without anyone noticing. `__tests__/roles.test.ts`
fails the build if anyone collapses them again.

## Theming

Class-based, never `prefers-color-scheme`. Both `.dark` and `.light` are subtree
switches that nest in either direction, because the dashboard needs a light
panel inside its dark sidebar and `:root` cannot express that.

`--base-mode` decides which mode seeds the bare `:root`, and it is a build flag
rather than a constant because the two apps invert: the marketing site hardcodes
`<html class="dark">`, the dashboard is light-default.

## What the package does not ship

- **Product imagery.** Brand furniture only: five textures (`dither-subpage`,
  `card1`–`card3`, `pixel-bg`, ~770 KB together) that `SectionBackdrop`,
  `DitheredMedia` and `FinalCta` are not reproducible without. This line read
  "one 77 KB texture, and nothing else", which stopped being true when the four
  halftone fields landed. The marketing site's `public/` is 26 MB of screenshots
  and video, which is content, and none of it is here. See `assets/README.md`
  for what was rejected and why.
- **Fonts.** `next/font` is a Next-only build-time API that has to be called from
  the consumer's own layout. The package declares the variable names it expects
  (`--font-geist-sans`, `--font-geist-mono`) and nothing more.
- **`@import "tailwindcss"`.** That belongs in the app, exactly once. Importing
  it from a dependency stylesheet gives duplicate preflight.

**Brand marks** used to sit in this list, as "not here yet". They landed on
2026-08-13: six SVGs under `assets/`, three symbol tones and three lockup tones,
rendered by `SkeneMark` and `SkeneLockup` in `patterns/skene-mark` and resolvable
as strings from `@skene/design-system/asset-urls`. Integration marks are still
out. Moved rather than deleted, because a "does not ship" entry that has quietly
started shipping is worse than no entry.

## Known gaps

- **The light brand values are derived, not designed.** This entry read "light-mode
  brand colours do not exist. Every brand and state colour fails WCAG AA on the
  light ladder" — two releases out of date. All four now carry a light variant and
  clear 4.5:1 against `surface.1` light: peach 4.61:1, matcha 4.50:1, amber
  4.60:1, error-red 4.56:1, asserted by `__tests__/roles.test.ts`. What is unfixed
  is that each value is the least-darkened hue-preserving colour that cleared the
  floor, recorded in the token's `$description`. No designer picked one, so the
  gap is aesthetic, not accessible. `KNOWN_GAPS` in the contrast gate is the live
  list and holds only the two shadcn destructive pairs.
- **`--sidebar-primary` is shadcn's default blue** in a peach system, carried
  identically by both apps. Recorded rather than silently corrected, because
  changing it is a visible design call.

## Asking

Ask before inventing a component, changing a token value, or when a surface role
is unclear. The cost of asking is a message; the cost of not is a fourth copy of
something that already exists.
