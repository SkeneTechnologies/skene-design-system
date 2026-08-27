---
"@skene/design-system": patch
---

skene-design-system-pages: stop routing marketing band spacing at the dashboard shell

v0.13.0 promoted the dashboard page-shell gutters into `shipped_here` in
`machine/layouts.yaml` as `page_gutters`, `gap-4 px-4 py-6 sm:px-6 lg:px-8`,
`utilities_resolve_here: true`, described as "the shipped contract" with no
surface scoping — and `skills/skene-design-system-pages` sent a page builder to
that file for "Section order within one band, spacing and widths". Scoping the
entry with `surface: dashboard` and a warning does not fix the routing; the
skill still pointed an agent at a dashboard-first file without naming the block
it should read.

Measured in a browser against the package's own compiled stylesheet, at
`--spacing: 0.2rem` and a 16px root: `py-6` resolves to **19.2px** of band
padding and `gap-4` to **12.8px**, against a marketing band's
`py-[96px] md:py-[128px]` and `gap-[32px] lg:gap-[64px]`. Five times and
two-to-five times apart. Compose a marketing page on `page_gutters` and every
band collapses to a dashboard row.

The pages skill now carries the two numbers, sends band geometry to section 5
`marketing` (`status: composed_here`), and sends the dashboard shell, the
workspace templates and the T-codes to the blocks that own them.
