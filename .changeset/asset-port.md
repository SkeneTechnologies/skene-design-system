---
"@skene/design-system": minor
---

Fourteen assets ported from skene-marketing-website, growing `assets/` from 12
to 26 files: `hero-dither.png` (kept as PNG — a lossless WebP re-encode came
out larger and lossy destroys the dots), the `agent-1/2/3.svg` illustration
set, the brand videos `skene-hero.mp4` and `skene-demo.mp4` for
`DitheredMedia`'s `video` prop, and eight third-party integration marks under
`assets/integrations/` (bolt, cursor, github, resend, supabase, terminal, v0,
windsurf), closing the README's "integration marks are not here yet" gap.

`assetUrls` gains `heroDither`, `agentOne`/`agentTwo`/`agentThree`,
`heroVideo`, and `demoVideo`. A new `integrationMarkUrls` map (with
`IntegrationMarkName`) keeps the third-party brands in their own namespace:
render at delivered proportions, never recolour.

`assets/README.md`'s exclusion table is rewritten around what still stays out
— product screenshots and blog images (content), press logos and event photos
(site-specific), and files unreferenced even on the live site.
