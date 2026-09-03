---
'@skene/design-system': patch
---

Re-encode the three card textures, `card1_bg`, `card2_bg` and `card3_bg`, at the same 1462 px and lossy WebP quality 50. 145,562 → 63,446 bytes, 185,736 → 72,878 and 232,696 → 95,012, a 56 to 59 percent cut with a mean per-channel error of 2.2 to 3.0 of 255. Every `ArtFrame` and `SectionBackdrop` on the raster path ships the smaller file; a route that paints all three fetches 231 KB instead of 564 KB. No API change.
