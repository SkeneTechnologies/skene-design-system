# Skene Cloud design system — UX patterns

Composition, components, layout, theming, and workflow patterns for Skene Cloud workspace UI.

> **Scope: this document is skene-dashboard prose, and it ships here unrewritten.**
>
> It came across with the tokens and still describes the dashboard repo from the
> inside. Read it for the *reasoning* — density, theming, workflow, the
> composition rules — which is why it was kept. Do not read its paths or its
> commands as facts about this package. Concretely, and verified 2026-08-14:
>
> - **Paths are dashboard paths.** `components/ui/*`, `components/dashboard/*`,
>   `components/workspace/templates/*`, `lib/design-tokens.ts` and
>   `app/globals.css` do not exist here. The primitives it lists under
>   `components/ui/` are in this package at `src/ui/`, imported as
>   `@skene/design-system/ui/<name>`.
> - **Most commands do not exist here.** This package's scripts are `tokens`,
>   `tokens:check`, `tokens:contrast`, `inventory`, `context`, `context:check`,
>   `build`, `test`, `verify`, `visual`. There is no `layout:catalog`,
>   `buttons:catalog`, `design:check`, `tokens:reconstruct-json` or `dev`, and
>   no `/design-system` route — the gallery here is the `docs-app` at
>   `/components`. Where the table at the end of this file says `npm run tokens`
>   regenerates `lib/design-tokens.ts` and `brand.md` tables, that is the
>   dashboard's script; here it writes `styles/tokens.css` and
>   `src/tokens/index.ts` and nothing else.
> - **The template T-codes are not shipped.** See `machine/layouts.yaml`.
>
> For this package: `machine/context.yaml` for which module to reach for,
> `machine/rules.yaml` for the rules, `docs/sections.md` for the sections,
> `docs/principles.md` for the narrative.

---

## 1. shadcn (`components/ui/`)

Config: `components.json` (style: **new-york**, RSC: **on**, CSS variables: **on**, base color: **neutral**, icon library: **lucide**, CSS entry: **`app/globals.css`**).

Install new primitives only with the project's shadcn CLI flow and user direction — do not hand-roll Radix wrappers.

### Available primitives (use these; do not duplicate)

| Component | File | Variants / notes |
|-----------|------|-------------------|
| Accordion | `components/ui/accordion.tsx` | Radix-based, uses `accordion-down` / `accordion-up` animations |
| Alert | `components/ui/alert.tsx` | `default`, `destructive` |
| Alert dialog | `components/ui/alert-dialog.tsx` | — |
| Badge | `components/ui/badge.tsx` | `default`, `secondary`, `destructive`, `outline` |
| Button | `components/ui/button.tsx` | Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon` |
| Card | `components/ui/card.tsx` | Exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Checkbox | `components/ui/checkbox.tsx` | Radix-based |
| Collapsible | `components/ui/collapsible.tsx` | Radix-based |
| Command | `components/ui/command.tsx` | cmdk-based |
| Dialog | `components/ui/dialog.tsx` | Full modal with overlay, close button, header/footer/title/description |
| Dropdown menu | `components/ui/dropdown-menu.tsx` | Radix-based |
| Hover card | `components/ui/hover-card.tsx` | Radix-based |
| Input | `components/ui/input.tsx` | Standard text input with focus ring, validation styles |
| Settings field | `components/ui/settings-field.tsx` | `SettingsInput` / `SettingsSelect` — filled card fields for workspace forms |
| Input group | `components/ui/input-group.tsx` | Composite input wrapper |
| Label | `components/ui/label.tsx` | — |
| Navigation menu | `components/ui/navigation-menu.tsx` | Radix-based |
| Popover | `components/ui/popover.tsx` | Radix-based |
| Progress | `components/ui/progress.tsx` | Brand gradient indicator (bronze-to-gold) |
| Select | `components/ui/select.tsx` | Radix-based with size `sm` / `default` |
| Sheet | `components/ui/sheet.tsx` | Side panel / drawer |
| Skeleton | `components/ui/skeleton.tsx` | Loading placeholder |
| Slider | `components/ui/slider.tsx` | Radix-based |
| Sonner (toasts) | `components/ui/sonner.tsx` | Error toasts persist until dismissed (`duration: Infinity`, `closeButton: true`) |
| Switch | `components/ui/switch.tsx` | Radix-based toggle |
| Table | `components/ui/table.tsx` | Full table with header, body, row, cell, caption, footer |
| Tabs | `components/ui/tabs.tsx` | Radix-based with `TabsList`, `TabsTrigger`, `TabsContent` |
| Textarea | `components/ui/textarea.tsx` | Multi-line text input |
| Tooltip | `components/ui/tooltip.tsx` | Radix-based |

### Button variants in detail

```tsx
import { Button } from "@/components/ui/button";

// Primary CTA — peach bg, dark text
<Button>Save</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Bordered, transparent bg
<Button variant="outline">Cancel</Button>

// Muted background
<Button variant="secondary">Settings</Button>

// No background, hover accent
<Button variant="ghost">Menu item</Button>

// Text link style
<Button variant="link">Learn more</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><X /></Button>

// As child (render as Link, etc.)
<Button asChild><Link href="/foo">Go</Link></Button>
```

---

## 2. Dashboard chrome (`components/dashboard-chrome/`)

Higher-level composites specific to the workspace product UI. Import these before building custom layouts. **Radius:** use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` — not `rounded-nav`, `rounded-panel`, or `rounded-[Npx]`.

| Component | File | Purpose |
|-----------|------|---------|
| PageActionBar | `PageActionBar.tsx` | Filter bar / toolbar above tables |
| StatusPill | `StatusPill.tsx` | Colored status indicator |
| ConnectionStatusBadge | `ConnectionStatusBadge.tsx` | Integration connection state |
| EmptyStateCard | `EmptyStateCard.tsx` | Placeholder for empty lists/tables |
| TableRow | `TableRow.tsx` | Standardized table row with surface ladder |
| SuccessHero | `SuccessHero.tsx` | Success state illustration/message |
| WorkspaceAvatarPill | `WorkspaceAvatarPill.tsx` | Workspace identity badge |
| TruncateWithTooltip | `TruncateWithTooltip.tsx` | Text overflow with tooltip |
| SidebarCollapsibleSection | `SidebarCollapsibleSection.tsx` | Collapsible sidebar group |

---

## 3. Tailwind CSS v4

- Entry: `@import "tailwindcss"` in `app/globals.css`
- Theme: `@theme inline { … }` — **only utilities listed there (or derived) are fair game**
- Animation plugin: `tailwindcss-animate` (accordion, slide, fade, zoom)

### Theme-aware semantic utilities

These respond to `.dark` / `.light` automatically:

| Utility | Role |
|---------|------|
| `bg-background`, `text-foreground` | Page background / default text |
| `bg-card`, `text-card-foreground` | Panels, cards, inset workspace chrome |
| `bg-primary`, `text-primary-foreground` | Primary actions (peach) |
| `bg-primary-hover` | Primary hover state |
| `bg-muted`, `text-muted-foreground` | Secondary copy, breadcrumbs, tab backgrounds |
| `bg-accent`, `text-accent-foreground` | Active/selected states |
| `border-border`, `bg-input`, `ring-ring` | Form chrome |
| `bg-destructive`, `text-destructive-foreground` | Error states |
| `bg-secondary`, `text-secondary-foreground` | Secondary buttons |
| `bg-popover`, `text-popover-foreground` | Popovers, dropdowns |
| `bg-sidebar`, `text-sidebar-foreground` | Sidebar-specific tokens |

### Brand tokens (fixed across themes)

| Utility | Hex | Role |
|---------|-----|------|
| `bg-brand-peach`, `text-brand-peach` | `#fec089` | Primary brand accent |
| `text-brand-peach-text` | `#3b2402` | Dark text on peach surfaces |
| `text-brand-link` | `#ce6100` | Hyperlink color |
| `bg-brand-bronze` / `text-brand-bronze` | `#8C6B47` | Gradient start, premium accents |
| `bg-brand-gold` / `text-brand-gold` | `#E8C260` | Gradient end, premium accents |
| `from-brand-gradient-from to-brand-gradient-to` | bronze → gold | Progress bars, CTAs |

### Dark surface ladder (always dark, not theme-toggled)

| Utility | Hex | Use |
|---------|-----|-----|
| `bg-surface-0` | `#0a0a0a` | Outermost page background (dark layouts) |
| `bg-surface-1` | `#171717` | Sidebar, panel base |
| `bg-surface-2` | `#212121` | Card / table row base |
| `bg-surface-3` | `#4a4a4a` | Active row, highlighted sidebar item |
| `bg-surface-mid-gray` | `#2A2A2A` | Variant tone |
| `bg-surface-darker` | `#060606` | Deepest surfaces |
| `bg-surface-deep` | `#1a1a1a` | Deep panel variant |
| `bg-surface-deep-2` | `#0b0b0b` | Deep panel variant |
| `bg-surface-elevated` | `#2c2c2c` | Elevated / floating surfaces |
| `border-surface-border` | `#363636` | Panel borders on dark surfaces |

**Ladder rule:** stack adjacent surfaces by going **up** the ladder (panel = `surface-1`, card inside panel = `surface-2`, hover = `surface-3`). Use borders for elevation, not shadows.

### Text tokens (paired with dark surfaces)

| Utility | Hex | Use |
|---------|-----|-----|
| `text-text-primary` | `#faf1e9` | Body text on dark surfaces |
| `text-text-muted` | `#a1a1aa` | Secondary text on dark surfaces |
| `text-text-muted-strong` | `rgba(255,255,255,0.7)` | Medium emphasis |
| `text-text-muted-weak` | `rgba(255,255,255,0.55)` | Low emphasis |
| `text-text-gray` | `#A1A1A1` | High-contrast subtitle |
| `text-text-gray-light` | `#c8cdd3` | Light gray text |

### Semantic / status colors

| Utility | Hex | Use |
|---------|-----|-----|
| `bg-semantic-matcha`, `text-semantic-matcha` | `#d7f4ab` | Success states |
| `text-semantic-matcha-deep` | `#1a3300` | Text on matcha backgrounds |
| `text-semantic-warning-amber` | `#e6b450` | Warnings (never use peach for warnings) |
| `text-semantic-error-red` | `#f25246` | Error states |

### Chart colors

Five chart tokens: `bg-chart-1` through `bg-chart-5` — theme-aware via `.dark` / `.light`.

### Sidebar-specific tokens

`bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`, `bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`, `ring-sidebar-ring`.

### Opacity syntax

Tailwind v4 style — `text-muted-foreground/80`, `border-border/20`, `bg-surface-0/50`.

---

## 4. Color palette summary

### Light mode (`:root` default)

| Token | Value | Role |
|-------|-------|------|
| `--background` | `#e1e1e1` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Body text (near black) |
| `--card` | `oklch(1 0 0)` | Card/panel background (white) |
| `--primary` | `#fec089` | Primary brand (peach) |
| `--primary-foreground` | `#060606` | Text on primary |
| `--muted` | `oklch(0.97 0 0)` | Muted background |
| `--muted-foreground` | `oklch(0.556 0 0)` | Muted text |
| `--border` | `oklch(0.922 0 0)` | Borders |
| `--destructive` | `oklch(0.656 0.198 28.1)` | Error/danger red |

### Dark mode (`.dark`)

| Token | Value | Role |
|-------|-------|------|
| `--background` | `oklch(0.145 0 0)` | Page background (near black) |
| `--foreground` | `oklch(0.985 0 0)` | Body text (near white) |
| `--card` | `oklch(0.205 0 0)` | Card background (dark gray) |
| `--primary` | `#edc29c` | Primary brand (warm peach) |
| `--primary-foreground` | `#060606` | Text on primary |
| `--muted` | `oklch(0.269 0 0)` | Muted background |
| `--muted-foreground` | `oklch(0.708 0 0)` | Muted text |
| `--border` | `oklch(1 0 0 / 10%)` | Borders (translucent white) |
| `--destructive` | `oklch(0.656 0.198 28.1)` | Error/danger red |

---

## 5. Typography

### Font families

| Family | CSS variable | Tailwind | Use |
|--------|-------------|----------|-----|
| Geist Sans | `--font-geist-sans` | `font-sans` (default) | Body, headings, UI text |
| Geist Mono | `--font-geist-mono` | `font-mono` | Code, terminal, eyebrows |

Loaded via `next/font/google` in `app/layout.tsx`. **Never** introduce Inter, Roboto, Poppins, Open Sans, Space Grotesk, or system-ui.

### Body configuration

```css
font-family: var(--font-sans);
font-feature-settings: "rlig" 1, "calt" 1;
```

Background and text color transition on theme change with `transition: background-color 0.3s ease, color 0.3s ease`.

---

## 6. Spacing

Base unit: `--spacing: 0.2rem` (Tailwind v4 spacing scale multiplier).

Named spacing tokens in `:root` (documentation aliases — **prefer Tailwind utilities in new UI**):

| Token | Value |
|-------|-------|
| `--spacing-0-5` | 2px |
| `--spacing-1` | 4px |
| `--spacing-2` | 8px |
| `--spacing-3` | 12px |
| `--spacing-4` | 16px |
| `--spacing-6` | 24px |
| `--spacing-8` | 32px |
| `--spacing-12` | 48px |
| `--spacing-16` | 64px |
| `--spacing-24` | 96px |
| `--spacing-32` | 128px |

Use standard Tailwind spacing utilities (`p-4`, `gap-6`, `mt-8`, etc.) — they derive from the base `--spacing` multiplier.

**Page gutters (workspace):** `gap-4 px-4 py-6 sm:px-6 lg:px-8` on `components/dashboard/DashboardPageShell.tsx` — the canonical list-page inset pattern.

---

## 6b. Layout (unified system)

**Authority for new workspace UI:** shadcn `components/ui/*` + Tailwind v4 utilities from `app/globals.css` `@theme inline`. Do **not** use Figma-era layout values from `lib/design-tokens.ts` or arbitrary `rounded-[Npx]` / `w-[Npx]`.

### Dual token sources

Two legacy layers still coexist with Tailwind/shadcn. **Do not add new usages** — migrate call sites when you touch them.

| Legacy source | Examples | Use instead (new workspace UI) |
|---------------|----------|--------------------------------|
| `lib/design-tokens.ts` `layout.*` | `sidebarWidth` 158px, `dashboard.pageGutter.*` | `w-60`, Tailwind `p-*` / `gap-*`, `DashboardPageShell` gutters |
| `:root` Figma-era radius vars | `--radius-nav`, `--radius-tight`, `--radius-panel`, `--radius-input` | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` |
| `import { tokens } from '@/lib/design-tokens'` for layout | `tokens.layout.dashboard.*` in TSX | Tailwind spacing + shadcn layout recipes (§6b table) |

`lib/design-tokens.ts` remains a committed reference for colors, typography metadata, and tooling — not for new layout or radius in components. Spacing: Tailwind `p-*`, `gap-*`, `m-*` only. Radius: **`rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl`** only (plus `rounded-full` for pills).

| Concern | Use |
|---------|-----|
| Spacing | Tailwind `p-*`, `gap-*`, `m-*` |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` |
| Panels | shadcn `Card` or `rounded-lg border border-border bg-card` |
| List pages | `DashboardPageShell` gutter pattern |
| Settings inset | `workspace-page-inset` + shadcn `Card` (`overflow-hidden rounded-lg shadow-none`) |
| Sidebar width | `w-60` (240px) — production standard in `Sidenav.tsx` |
| Max width | `max-w-5xl`, `max-w-7xl`, `max-w-full` |
| Form fields (workspace) | `SettingsInput` / `SettingsSelect` (`components/ui/settings-field.tsx`) — not raw `Input` / Radix `Select` on dense form surfaces |

**Page patterns** (templates under `components/workspace/templates/`):

| Pattern | Template | Figma T-code | Use |
|---------|----------|--------------|-----|
| List | `ListTemplate.tsx` | T2 | Table + filter bar pages via `DashboardPageShell` |
| Settings | `SettingsTemplate.tsx` | T1 | Two-pane settings (vertical tabs + content) |
| Detail | `DetailTemplate.tsx` | T3 | Step-driven / onboarding flows |
| Dashboard | `DashboardTemplate.tsx` | T4 | Overview canvas with rich chrome |
| Canvas | `CanvasTemplate.tsx` | T2-canvas | Full-bleed agent-canvas, mission-designer |

Anchors and node IDs: `documentation/figma-coverage.json` **in skene-dashboard** — that file is not in this package, so this was a dead link here. When porting a Figma frame, pick the matching template — do not fork a new layout shell.

**Legacy (deprecated — do not use for new code):**

- `lib/design-tokens.ts` `layout.*` block (158px sidebar, Figma gutter px literals)
- `:root --radius-nav`, `--radius-tight`, `--radius-panel`, `--radius-input` and classes `rounded-nav`, `rounded-panel`
- Analytics `--spacing-xs/sm/md/...` in styled-components scope

Live reference: `/design-system/layout` (dev only). Drift tab filters use `SettingsInput` / `SettingsSelect` to match workspace settings. Drift scan: `npm run layout:catalog`.

---

## 7. Radius scale

### Canonical (shadcn `@theme inline` — use for new UI)

| Utility | Source | ~Value |
|---------|--------|--------|
| `rounded-sm` | `calc(var(--radius) - 4px)` | ~6px |
| `rounded-md` | `calc(var(--radius) - 2px)` | ~8px |
| `rounded-lg` | `var(--radius)` | 10px |
| `rounded-xl` | `calc(var(--radius) + 4px)` | ~14px |
| `rounded-full` | Tailwind default | pill |

Base: `--radius: 0.625rem` (10px) in `:root`.

### Legacy (deprecated — migration targets)

| Token | Value | Notes |
|-------|-------|-------|
| `--radius-input` | 6px | Was `settings-field` — use `rounded-sm` |
| `--radius-nav` | 5.2px | Prefer `rounded-sm` or `rounded-md` |
| `--radius-tight` | 7.2px | Prefer `rounded-lg` |
| `--radius-panel` | 8px | Prefer `rounded-lg border border-border` |
| `--radius-lg` | 10px | Same as shadcn `rounded-lg` — legacy `workspace-panel` CSS class |
| `--radius-xl` | 12px | Hero cards |
| `--radius-pill` / `--radius-full` | 9999px | Pills — prefer `rounded-full` |

---

## 8. Theming (class-based, not `prefers-color-scheme`)

| Class | Scope | Description |
|-------|-------|-------------|
| *(none)* | `:root` default | **Light** palette for workspace pages |
| `.dark` | Any subtree | Switches to dark palette (sidebar, marketing, onboarding, public pages) |
| `.light` | Inside `.dark` | Escapes back to light (e.g. notification panel inside dark sidebar) |

### Usage

```tsx
// Dark section
<div className="dark">
  <h1 className="text-foreground">Title</h1>   {/* reads from .dark palette */}
</div>

// Light island inside dark
<div className="dark">
  <aside className="light">
    <p className="text-foreground">Light text</p>  {/* reads from .light palette */}
  </aside>
</div>
```

### Prefer theme tokens over raw hex

| Use this | Not this |
|----------|----------|
| `text-foreground` | `text-[#faf1e9]` or `text-white` |
| `bg-background` | `bg-[#0a0a0a]` |
| `bg-card` | `bg-[#212121]` |
| `text-muted-foreground` | `text-[#737373]` |
| `border-border` | `border-[#363636]` |
| `bg-primary` | `bg-[#EDC29C]` |

Raw hex is acceptable only for brand colors that never change across themes or for fixed overlays/modals that float outside the document flow.

---

## 9. Animations

Defined in `app/globals.css`:

| Class | Keyframes | Duration | Use |
|-------|-----------|----------|-----|
| `animate-slide-in-up` | `slide-in-up` | 0.6s ease-out | Page entrance, element reveal |
| `animate-pulse-subtle` | `pulse-subtle` | 3s infinite | Subtle attention pulse |
| `animate-accordion-down` | `accordion-down` | 0.2s ease-out | Accordion open |
| `animate-accordion-up` | `accordion-up` | 0.2s ease-out | Accordion close |
| `animate-shimmer` | `shimmer` | 2s infinite | Loading skeleton shimmer |
| `animate-shimmer-text` | `shimmer-text` | configurable via `--shimmer-duration` | Text loading effect with gradient |

Additional animations from `tailwindcss-animate` plugin: `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `zoom-in-95`, `zoom-out-95`, `slide-in-from-*`, etc. — used by Dialog, Select, Popover overlays.

---

## 10. Workspace page chrome

### Approved layout pattern

```tsx
import { Card } from '@/components/ui/card'

// Standard workspace page layout
<div className="workspace-page-inset">
  <Card className="overflow-hidden rounded-lg shadow-none">
    {/* content */}
  </Card>
</div>
```

| Class / primitive | Styles | Use |
|-------------------|--------|-----|
| `workspace-page-inset` | `flex: 1 1 0%; min-height: 0; padding: var(--spacing-4)` | Outer page wrapper with padding |
| shadcn `Card` + `rounded-lg shadow-none` | `bg-card`, `text-card-foreground`, 10px radius | Content panel (Settings, API Keys, Skene MCP, Journey) |

**Deprecated:** `workspace-panel` global class — migrated call sites use `Card` above. The CSS class remains in `globals.css` until remaining references are removed.

Do not recreate these layouts with one-off arbitrary radius or width classes.

---

## 11. Icons

**Library:** `lucide-react` — the only icon library. Do not introduce Heroicons, Phosphor, or others.

```tsx
import { ArrowRight, Settings, X } from "lucide-react";

<ArrowRight className="h-4 w-4" />
<Settings size={18} />
```

Icons inherit `currentColor` — drive color with text utilities (`text-muted-foreground`, `text-brand-peach`, etc.). Always verify the icon export exists in the installed version before importing.

---

## 12. Toasts

Via `sonner` through `components/ui/sonner.tsx`:

```tsx
import { toast } from "sonner";

toast.success("Changes saved");
toast.error("Failed to save");  // persists until dismissed (Infinity duration)
toast("Neutral notification");
```

Error toasts are configured globally with `duration: Infinity` and `closeButton: true` so users must actively dismiss them. The `Toaster` component uses `theme="light"`.

---

## 13. Forms

Standard patterns:

- **Primitives:** `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `Label` from `components/ui/`
- **Validation styles:** Inputs support `aria-invalid` for error states (red ring + border)
- **Focus rings:** `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Workspace forms:** Use `SettingsInput` / `SettingsSelect` from `components/ui/settings-field.tsx`

---

## 14. Component layers (where code lives)

Import in this order:

1. **`components/ui/`** — generic shadcn primitives plus `settings-field` (`SettingsInput` / `SettingsSelect`)
2. **Dashboard chrome** — `components/dashboard-chrome/` (`PageActionBar`, `StatusPill`, `EmptyStateCard`, …); page header lives in `components/workspace/PageHeader.tsx`
3. **Workspace feature UI** — `components/workspace/`
4. **Settings** — `components/settings/`

| Area | Path | Notes |
|------|------|--------|
| Workspace app | `app/workspace/[slug]/` | Light default; sidebar often `dark` |
| Settings | `components/settings/` | Prefer settings templates / tabs |
| Onboarding | `components/onboarding/` | Step-driven flows |
| Internal marketing OS | `app/internal/marketing/` | Drafts and publish flows for the external site; voice rules in `CLAUDE.md` |

---

## 15. Styling patterns in TSX

```tsx
// Compose shadcn + token utilities
<Button variant="outline" size="sm">Save</Button>
<div className={cn("flex gap-2 rounded-lg border border-border bg-card p-4", className)} />

// Arbitrary values not in the theme (DO NOT DO THIS)
<div className="bg-[#212121] text-[13px] rounded-[7.2px]" />
```

- **`cn()`** from `@/lib/utils` for class merging — the only approved utility
- **`data-slot`** attribute on all shadcn primitives for CSS targeting and debugging
- **Server Components** by default; `'use client'` only when needed
- **`cursor-pointer`** is set globally on all interactive elements via `@layer base` — do not add manually

---


---

## 17. Breakpoints

| Token | Value |
|-------|-------|
| `--breakpoint-sm` | 640px |
| `--breakpoint-md` | 768px |
| `--breakpoint-lg` | 1024px |
| `--breakpoint-xl` | 1280px |
| `--breakpoint-2xl` | 1440px |

Standard Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.

---

---

## Figma and extended rules

We do **not** use Figma MCP. For Figma-driven dashboard work:

1. Open the frame in the Skene Cloud workspace Figma file — its key and the per-frame node IDs are in `documentation/figma-coverage.json` **in skene-dashboard**, which is private. The key used to be written out here; it was removed when this repository went public, since a file key is the addressable half of a private design file and there is no reason for it to sit in a public document.
2. Reuse existing components under `components/dashboard-chrome/` and `components/workspace/` before building new chrome.
3. Map specs to shadcn + Tailwind utilities from this document — not Figma export CSS or `tokens.*` layout literals.
4. Compare rendered UI to the Figma frame manually; run `tests/visual/fidelity/fidelity.spec.ts` **in skene-dashboard** when a baseline exists — not a path in this package.

Also read:

- `.cursor/rules/figma-cloud-design-system.mdc` — Figma anchors, template T-codes, coverage checklist (public-site Figma lives in skene-marketing-website)
- `.cursor/rules/theming-and-dark-mode.mdc` — `.dark` / `.light` classes

Those files assume this document's **ask-first** and **no undefined UI** rules.

---

## Design system dev page

A live design system reference is available at `/design-system` (**dev only** — returns 404 in production). There is no separate design-system server or `restart` script; it runs inside the main Next.js app.

### Run and restart

1. Start (or restart) the dev server: `npm run dev`
2. Open **http://localhost:3000/design-system** (Overview) or any section route below

To pick up UI or route changes, stop the dev server (Ctrl+C) and run `npm run dev` again.

After editing `design-tokens.json` or other generated token output, run `npm run tokens`, then restart the dev server. Generated tables land in `design-system/docs/brand.md` **in skene-dashboard**. In this package the equivalent is `docs/brand.md`, written by `scripts/generate-token-docs.mjs` and gated by `npm run tokens:check`.

### Overview

- **Overview** (`/design-system`) — token hierarchy, inventory health snapshot (layout unified ratio, button counts), section index, and refresh commands
- Layout width tokens (`w-panel`, `w-journey-node`, `w-overview-dock`, etc.) are documented on the Layout → Configuration and Samples tabs

### Tabs

- **Components** — solution guide (when to use which primitive), shadcn + dashboard-chrome inventory
- **Buttons** — token reference, interactive gallery, codebase inventory scan (`npm run buttons:catalog`)
- **Inputs** — settings patterns, primitive gallery, token reference
- **Colors** — palette swatches, `:root` / `@theme inline` configuration
- **Typography** — font samples, scale conventions, drift callouts
- **Layout** — unified shadcn/Tailwind spacing, radius, page patterns, workspace chrome, drift inventory (`npm run layout:catalog`)

### Related commands

| Command | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (design system at `/design-system`) |
| `npm run tokens` | Regenerate `lib/design-tokens.ts`, `design-system/docs/brand.md` tables, `machine/tokens.yaml`, and CSS from `design-tokens.json` |
| `npm run tokens:reconstruct-json` | Recreate `design-tokens.json` from `lib/design-tokens.ts` if the JSON file is missing |
| `npm run tokens:check` | Fail if token outputs are stale (CI) |
| `npm run buttons:catalog` | Regenerate button inventory JSON for the Buttons tab |
| `npm run layout:catalog` | Regenerate layout drift inventory for the Layout tab |
| `npm run design:check` | Report hardcoded hex / off-token sizes and radii |
| `npm run design:check -- --strict` | Fail on new design-token violations vs baseline (pre-commit) |

Shell: `components/design-system/DesignSystemShell.tsx`. Catalogs: `lib/design-system/*-catalog.ts`. Layout/spacing authority: Tailwind + `@theme inline` in `app/globals.css` (see §6b).
