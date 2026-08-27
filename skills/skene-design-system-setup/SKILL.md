---
name: skene-design-system-setup
description: "Use when adding @skene/design-system to a repository for the first time, or when its components render but look wrong — unstyled, zero-height, or missing utilities. Triggers include: installing or configuring @skene/design-system, wiring its stylesheet, adding the Tailwind @source line, a component that renders at zero height or with no styling, LogoRow collapsing, utilities from the package missing from the emitted CSS, or a 404/auth failure installing the restricted package. Do NOT use for choosing which component to build with (that is skene-design-system) or for assembling a whole page (that is skene-design-system-pages)."
---

# Setting up @skene/design-system in a repo

Four steps. Step 3 is the only one that fails **silently**, so it is the only
one with a proof attached — the rest fail loudly and need no ceremony.

## 1. Install

```bash
npm install @skene/design-system
```

Published **restricted**, so the install needs a credential. A missing one
presents as a **404, not a 401** — do not go looking for a typo in the name.

- CI: `actions/setup-node` with `registry-url: https://registry.npmjs.org`, and
  `NODE_AUTH_TOKEN` from a repository secret.
- Local: the token belongs in `~/.npmrc`.
- **Never a project-level `.npmrc`.** That is a token in a commit.

Repos not yet migrated use a git dependency instead —
`git+https://github.com/SkeneTechnologies/skene-design-system.git#semver:^0.13.0`.

## 2. Wire the stylesheet

At the top of the app's own stylesheet:

```css
@import "tailwindcss";                      /* stays in the app, exactly once */
@import "@skene/design-system/styles.css";
```

## 3. Add the `@source` line, then prove it took

```css
@source "../../node_modules/@skene/design-system/dist";
```

Path is relative to **your** stylesheet. That one is right for
`src/app/globals.css`; one at `app/globals.css` drops a `../`.

Add it unconditionally. The package declares its own `@source`, which is enough
under the Tailwind CLI and Vite — **under Turbopack it is not**. The build
resolves the `@import` and then never scans the imported file's own `@source`,
so every utility only the package's components use is silently absent.

That shipped: `LogoRow` rendered as a zero-height strip because `min-h-14`
never reached the stylesheet. No error, no warning.

**Prove it:**

```bash
npm run build
grep -r "min-h-14" .next/static/css/ || echo "NOT GENERATED — @source did not take"
```

`min-h-14` is used only by this package's components, so it reaches the
stylesheet only if your build scanned the package. If the grep misses, the
`@source` path is wrong for your stylesheet's location — count the `../` again.

The line is idempotent where the package's own `@source` already works, since
Tailwind dedupes scanned files.

## 4. Decide theming

`next-themes` is an **optional** peer. Install it if the app flips light/dark;
skip it if the app is dark-only. Nothing else in the package needs it.

## Then render one component before building anything

A `Button` is enough. It proves resolution, styles and the theme class in one
go, and it is far cheaper to debug than a half-built page.

```tsx
import { Button } from '@skene/design-system/ui/button'
```

Deep-import like that rather than from the root barrel when the React Server
Components boundary matters: the barrel carries no `"use client"` on purpose,
so `Card`, `Badge`, `Table` and `Alert` stay server-renderable, and only the 8
modules that need the directive carry it themselves.

## One rule to know before your first section

**A light surface on a dark page needs the `light` class on its root.** Check
the module's `polarity` in `machine/context.yaml`. Without it, mode-aware
tokens resolve to their dark values against a light fill — that has shipped
text at 1.08:1.

## Where to go next

Setup is mechanical; the contracts are for deciding what to build.

- Picking a component → the `skene-design-system` skill.
- Assembling a whole page → the `skene-design-system-pages` skill.
- The full reference ships in the package at
  `node_modules/@skene/design-system/AGENTS.md`.
