# Skene Cloud design system — brand

Brand identity, color palette, and typography. Token hex tables are auto-generated below from `design-tokens.json`.

**Brand peach for new CTAs:** `bg-brand-peach` / `#fec089`. shadcn `--primary` (`#edc29c` legacy peach) drives existing Button primary paths.

<!-- @tokens:generated:start -->

_Generated from `design-tokens.json` by `scripts/generate-token-docs.mjs`. Do not edit
between the markers — change the JSON and run `npm run tokens`. `npm run tokens:check`
fails the build if this block is stale._

_Source version 2.7.0, 221 tokens, of which 54 are mode-aware and
shown here in every mode they declare._

### color

| Token | Value | Description |
| --- | --- | --- |
| `color.brand.peach` | light `#89684a` · dark `#fec089` | Light value is DERIVED, not designed: the least-darkened hue-preserving value clearing 4.61:1 on surface.1 light. Replace with a designed colour that clears 4.5:1. |
| `color.brand.peachText` | light `#faf1e9` · dark `#3b2402` | Text ON a peach fill. Inverts with brand.peach: cream on the darker light-mode peach, near-black on the lighter dark-mode peach. |
| `color.brand.bronze` | `#8c6b47` |  |
| `color.brand.gold` | `#e8c260` |  |
| `color.brand.light` | `#faf1e9` |  |
| `color.brand.peachDeep` | `#f97316` | INVARIANT, unlike brand.peach and brand.peachText beside it — the same #f97316 in both modes. The name reads as a sibling of brand.peach and it is not one, which is a trap: used as text on a cream ground it measures 2.51:1 against a 4.5 floor, and skene-site shipped exactly that on 2026-08-15 across four inline links at three viewports. This token is a gradient endpoint and a dark-ground accent. For text that must survive a light ancestor use brand.peach, which resolves #89684a inside `light`. Note the contrast gate cannot catch the misuse: `brand.peach-deep\|*` is in skip_pairs, so it is excused against EVERY background. |
| `color.accent.violet` | `#c9a2dd` | Feature-row icon tint. Promoted from the Stand demo capture; nothing in the package was within ΔE 52 (nearest was neon.engagement). Mode-invariant on purpose — drawn against dark surfaces only, like the rest of the brand palette. |
| `color.accent.blue` | `#9bbbd5` | Feature-row icon tint. Promoted from the Stand demo capture; nearest existing was neon.engineering at ΔE 24.3, far too saturated to substitute. Mode-invariant — see accent.violet. |
| `color.chrome.surface.0` | `#0a0a0a` |  |
| `color.chrome.surface.1` | `#171717` |  |
| `color.chrome.surface.2` | `#212121` |  |
| `color.chrome.surface.3` | `#4a4a4a` |  |
| `color.chrome.surface.midGray` | `#2a2a2a` |  |
| `color.chrome.surface.darker` | `#060606` |  |
| `color.chrome.surface.deep` | `#1a1a1a` |  |
| `color.chrome.surface.deep2` | `#0b0b0b` |  |
| `color.chrome.surface.elevated` | `#2c2c2c` |  |
| `color.chrome.surface.border` | `#363636` |  |
| `color.chrome.line.subtle` | `rgba(255, 255, 255, 0.12)` | Default hairline between sections and on cards. Alpha rather than an opaque token because sections stack on four different grounds (surface.1, deep, deep2, surface.2) and an opaque border is correct on exactly one of them. |
| `color.chrome.line.strong` | `rgba(255, 255, 255, 0.2)` | Emphasised hairline — active/hovered card edges. See line.subtle for why alpha. |
| `color.chrome.line.onLight` | `rgba(20, 20, 20, 0.14)` | Hairline for the inverted case: dark rule on a cream/peach fill. |
| `color.chrome.text.primary` | `#faf1e9` |  |
| `color.chrome.text.muted` | `#8c8c8c` |  |
| `color.chrome.text.mutedStrong` | `rgba(255, 255, 255, 0.6)` |  |
| `color.chrome.text.mutedWeak` | `rgba(255, 255, 255, 0.5)` |  |
| `color.chrome.text.mutedWarm` | `rgba(250, 241, 233, 0.68)` | Muted body copy that fades the brand cream (chrome.text.primary) rather than pure white. Preferred over text.muted/mutedStrong on marketing surfaces: the brand foreground is #faf1e9, so fading toward white drifts away from the brand as the text gets quieter. |
| `color.chrome.text.mutedWarmStrong` | `rgba(250, 241, 233, 0.82)` | The louder rung of mutedWarm — lede paragraphs and secondary headings. |
| `color.chrome.text.gray` | `#a1a1a1` |  |
| `color.chrome.text.grayLight` | `#c8cdd3` |  |
| `color.chrome.text.goldSoft` | `#d4b050` |  |
| `color.surface.0` | light `#fafafa` · dark `#0a0a0a` |  |
| `color.surface.1` | light `#f4f4f5` · dark `#171717` |  |
| `color.surface.2` | light `#ececef` · dark `#212121` |  |
| `color.surface.3` | light `#d4d4d8` · dark `#4a4a4a` |  |
| `color.surface.midGray` | light `#e7e7ea` · dark `#2a2a2a` |  |
| `color.surface.darker` | light `#060606` · dark `#060606` |  |
| `color.surface.deep` | light `#f0f0f0` · dark `#1a1a1a` |  |
| `color.surface.deep2` | light `#e9e9e9` · dark `#0b0b0b` |  |
| `color.surface.elevated` | light `#e4e4e7` · dark `#2c2c2c` |  |
| `color.surface.border` | light `#e4e4e7` · dark `#363636` |  |
| `color.text.primary` | light `#0a0a0a` · dark `#faf1e9` |  |
| `color.text.muted` | light `#525252` · dark `#8c8c8c` |  |
| `color.text.mutedStrong` | light `rgba(0, 0, 0, 0.7)` · dark `rgba(255, 255, 255, 0.6)` |  |
| `color.text.mutedWeak` | light `rgba(0, 0, 0, 0.55)` · dark `rgba(255, 255, 255, 0.5)` |  |
| `color.text.gray` | light `#4b5563` · dark `#a1a1a1` |  |
| `color.text.grayLight` | light `#6b7280` · dark `#c8cdd3` |  |
| `color.text.goldSoft` | `#d4b050` |  |
| `color.semantic.matcha` | light `#677552` · dark `#d7f4ab` | Light value is DERIVED, not designed: the least-darkened hue-preserving value clearing 4.5:1 on surface.1 light. Replace with a designed colour that clears 4.5:1. |
| `color.semantic.matchaDeep` | `#1a3300` |  |
| `color.semantic.warningAmber` | light `#886a2f` · dark `#e6b450` | Light value is DERIVED, not designed: the least-darkened hue-preserving value clearing 4.6:1 on surface.1 light. Replace with a designed colour that clears 4.5:1. |
| `color.semantic.errorRed` | light `#c44239` · dark `#f25246` | Light value is DERIVED, not designed: the least-darkened hue-preserving value clearing 4.56:1 on surface.1 light. Replace with a designed colour that clears 4.5:1. |
| `color.semantic.destructive` | `var(--destructive)` |  |
| `color.semantic.errorRedOnTint` | light `#b33c34` · dark `#f25246` | Text on a 10% tint of semantic.errorRed, which is what a StatPill label sits on. DERIVED, not designed: the least-darkened hue-preserving value clearing 4.6:1 on that ground, measured off the rendered pill rather than off the surface ladder. It exists because the light variant of semantic.errorRed was derived against surface.1 and a tinted pill is a different, warmer ground: the label landed at 3.98 and 4.36 against a 4.5:1 floor. Dark is unchanged from the base token; the dark tint is dark and the base value already clears there. Replace with a designed colour. Re-derived in 0.5.2 against EVERY ground the label is observed on, not one sampled ground. The 0.5.1 values were derived against a 10%% tint; StatPill's `ok` uses a 12%% fill and the artifacts sit on more than one card colour, so matcha landed at 4.24 and amber at 4.21 on grounds the derivation had never seen. |
| `color.semantic.warningAmberOnTint` | light `#7e622b` · dark `#e6b450` | Text on a 10% tint of semantic.warningAmber, which is what a StatPill label sits on. DERIVED, not designed: the least-darkened hue-preserving value clearing 4.6:1 on that ground, measured off the rendered pill rather than off the surface ladder. It exists because the light variant of semantic.warningAmber was derived against surface.1 and a tinted pill is a different, warmer ground: the label landed at 4.45 against a 4.5:1 floor. Dark is unchanged from the base token; the dark tint is dark and the base value already clears there. Replace with a designed colour. Re-derived in 0.5.2 against EVERY ground the label is observed on, not one sampled ground. The 0.5.1 values were derived against a 10%% tint; StatPill's `ok` uses a 12%% fill and the artifacts sit on more than one card colour, so matcha landed at 4.24 and amber at 4.21 on grounds the derivation had never seen. |
| `color.semantic.matchaOnTint` | light `#5d694a` · dark `#d7f4ab` | Text on a 10% tint of semantic.matcha, which is what a StatPill label sits on. DERIVED, not designed: the least-darkened hue-preserving value clearing 4.6:1 on that ground, measured off the rendered pill rather than off the surface ladder. It exists because the light variant of semantic.matcha was derived against surface.1 and a tinted pill is a different, warmer ground: the label landed at 4.26 against a 4.5:1 floor. Dark is unchanged from the base token; the dark tint is dark and the base value already clears there. Replace with a designed colour. Re-derived in 0.5.2 against EVERY ground the label is observed on, not one sampled ground. The 0.5.1 values were derived against a 10%% tint; StatPill's `ok` uses a 12%% fill and the artifacts sit on more than one card colour, so matcha landed at 4.24 and amber at 4.21 on grounds the derivation had never seen. |
| `color.neon.engineering` | `#80eaff` |  |
| `color.neon.marketing` | `#ff007f` |  |
| `color.neon.sales` | `#ff3131` |  |
| `color.neon.success` | `#39ff14` |  |
| `color.neon.product` | `#ffaa00` |  |
| `color.neon.engagement` | `#8b5cf6` |  |
| `color.terminalChrome.trafficRed` | `#ff5f56` |  |
| `color.terminalChrome.trafficYellow` | `#ffbd2e` |  |
| `color.terminalChrome.trafficGreen` | `#27c93f` |  |
| `color.terminalChrome.trafficGreenAlt` | `#58d845` |  |
| `color.terminalChrome.terminalRed` | `#ff5555` |  |
| `color.terminalChrome.githubDarkBg` | `#0d1117` |  |
| `color.terminalChrome.githubDarkSurface` | `#161b22` |  |
| `color.terminalChrome.githubBorder` | `#30363d` |  |
| `color.terminalChrome.githubText` | `#c9d1d9` |  |
| `color.terminalChrome.vscodeTeal` | `#4ec9b0` |  |
| `color.terminalChrome.tailwindEmerald` | `#22c55e` |  |
| `color.terminalChrome.warmTan` | `#ac8b5d` |  |
| `color.terminalChrome.githubLightBg` | `#f6f8fa` | Primer canvas.subtle. The PR-comment mockups on the homepage render GitHub light, and the package only had Primer dark. |
| `color.terminalChrome.githubLightSurface` | `#ffffff` | Primer canvas.default — the comment body itself. |
| `color.terminalChrome.githubLightBorder` | `#d0d7de` | Primer border.default. |
| `color.terminalChrome.githubLightText` | `#1f2328` | Primer fg.default. |
| `color.terminalChrome.githubLightMuted` | `#656d76` | Primer fg.muted — timestamps, "commented 2 days ago". |
| `color.terminalChrome.githubLightSubtle` | `#59636e` | Primer fg.subtle. |
| `color.terminalChrome.githubSuccessFg` | `#1a7f37` | Primer success.fg — the green check on a passing run. |
| `color.terminalChrome.githubSuccessBg` | `#dafbe1` | Primer success.subtle. |
| `color.terminalChrome.githubDangerFg` | `#cf222e` | Primer danger.fg — a failing check. |
| `color.terminalChrome.githubDangerBg` | `#ffcecb` | Primer danger.subtle. |
| `color.terminalChrome.githubDangerEmphasis` | `#82071e` | Primer danger.emphasis. |
| `color.terminalChrome.supabaseGreen` | `#3ecf8e` | Supabase brand green. Used only inside Supabase panel mockups; it is their identity, not ours. |
| `color.legacy.peach` | `#edc29c` |  |
| `color.legacy.peachHover` | `#ebdccf` |  |
| `color.legacy.primaryForeground` | `#060606` |  |
| `color.terminal.bg` | `#1e1e1e` |  |
| `color.terminal.bar` | `#2d2d30` |  |
| `color.terminal.rail` | `#252526` |  |
| `color.terminal.border` | `#3e3e3e` |  |
| `color.terminal.text` | `#cccccc` |  |
| `color.terminal.muted` | `#858585` |  |

### font

| Token | Value | Description |
| --- | --- | --- |
| `font.family.sans` | `Geist, ui-sans-serif, system-ui` |  |
| `font.family.mono` | `Geist Mono, ui-monospace, monospace` |  |
| `font.size.sectionCaption` | `9px` |  |
| `font.size.pill` | `11px` |  |
| `font.size.bodySm` | `12px` |  |
| `font.size.body` | `13px` |  |
| `font.size.label` | `14px` |  |
| `font.size.ui` | `14px` |  |
| `font.size.lede` | `15px` |  |
| `font.size.modalTitle` | `16px` |  |
| `font.size.stageHeader` | `18px` |  |
| `font.size.cardTitle` | `20px` |  |
| `font.size.h2` | `24px` |  |
| `font.size.subhero` | `26px` |  |
| `font.size.displaySm` | `28px` |  |
| `font.size.h1` | `30px` |  |
| `font.size.display` | `34px` |  |
| `font.size.displayMd` | `44px` |  |
| `font.size.displayLg` | `52px` |  |
| `font.size.marketingXl` | `32px` |  |
| `font.size.marketingXxl` | `48px` |  |
| `font.size.marketingHero` | `67px` |  |
| `font.weight.regular` | `400` |  |
| `font.weight.medium` | `500` |  |
| `font.weight.semibold` | `600` |  |
| `font.weight.bold` | `700` |  |
| `font.tracking.sectionCaption` | `0.9px` |  |
| `font.tracking.eyebrow` | `0.16em` |  |
| `font.tracking.displayTight` | `-0.02em` |  |
| `font.tracking.displayTighter` | `-0.024em` |  |
| `font.tracking.displayTightest` | `-0.035em` |  |
| `font.lineHeight.tight` | `1.15` |  |
| `font.lineHeight.snug` | `1.25` |  |
| `font.lineHeight.normal` | `1.5` |  |
| `font.lineHeight.relaxed` | `1.625` |  |

### spacing

| Token | Value | Description |
| --- | --- | --- |
| `spacing.1` | `4px` |  |
| `spacing.2` | `8px` |  |
| `spacing.3` | `12px` |  |
| `spacing.4` | `16px` |  |
| `spacing.6` | `24px` |  |
| `spacing.8` | `32px` |  |
| `spacing.12` | `48px` |  |
| `spacing.16` | `64px` |  |
| `spacing.24` | `96px` |  |
| `spacing.32` | `128px` |  |
| `spacing.0.5` | `2px` |  |

### radius

| Token | Value | Description |
| --- | --- | --- |
| `radius.none` | `0px` |  |
| `radius.input` | `6px` |  |
| `radius.nav` | `5.2px` |  |
| `radius.tight` | `7.2px` |  |
| `radius.panel` | `8px` |  |
| `radius.lg` | `10px` |  |
| `radius.xl` | `12px` |  |
| `radius.2xl` | `16px` | Marketing card radius. The ladder below this was drawn for dense dashboard chrome and stops at 12px; marketing surfaces are visibly rounder and were forced to hardcode 16px. |
| `radius.3xl` | `24px` | Large marketing panel radius — hero cards, plan tiles. |
| `radius.pill` | `9999px` |  |
| `radius.full` | `9999px` |  |

### shadow

| Token | Value | Description |
| --- | --- | --- |
| `shadow.panel` | `0 0 0 1px rgba(10,10,10,0.1)` |  |
| `shadow.popover` | `0 10px 15px -3px rgba(0,0,0,0.4)` |  |
| `shadow.modal` | `0 25px 50px -12px rgba(0,0,0,0.5)` |  |
| `shadow.terminal` | `0 32px 64px -16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)` |  |

### duration

| Token | Value | Description |
| --- | --- | --- |
| `duration.instant` | `100ms` |  |
| `duration.short` | `200ms` |  |
| `duration.medium` | `300ms` |  |
| `duration.long` | `1500ms` |  |

### easing

| Token | Value | Description |
| --- | --- | --- |
| `easing.out` | `ease-out` |  |
| `easing.in` | `ease-in` |  |
| `easing.inOut` | `ease-in-out` |  |

### breakpoint

| Token | Value | Description |
| --- | --- | --- |
| `breakpoint.sm` | `640px` |  |
| `breakpoint.md` | `768px` |  |
| `breakpoint.lg` | `1024px` |  |
| `breakpoint.xl` | `1280px` |  |
| `breakpoint.2xl` | `1440px` |  |

### layout

| Token | Value | Description |
| --- | --- | --- |
| `layout.sidebarWidth` | `158px` |  |
| `layout.dashboard.pageGutter.sm` | `16px` |  |
| `layout.dashboard.pageGutter.md` | `24px` |  |
| `layout.dashboard.pageGutter.lg` | `32px` |  |
| `layout.dashboard.panelPadding` | `16px` |  |
| `layout.dashboard.tableRowHeight` | `36px` |  |
| `layout.dashboard.tableHeaderHeight` | `32px` |  |
| `layout.dashboard.tabStripHeight` | `32px` |  |
| `layout.dashboard.breadcrumbHeight` | `28px` |  |
| `layout.dashboard.sectionGap` | `24px` |  |
| `layout.dashboard.heroPadY` | `24px` |  |
| `layout.maxContent.prose` | `768px` |  |
| `layout.maxContent.default` | `1280px` |  |
| `layout.maxContent.wide` | `1408px` |  |

### shadcn

| Token | Value | Description |
| --- | --- | --- |
| `shadcn.background` | light `#f4f4f4` · dark `oklch(0.145 0 0)` | Light is the dashboard's #f4f4f4, not shadcn's pure white. The dashboard is the light-default surface and ships this in production; marketing was oklch(1 0 0) and repaints. |
| `shadcn.foreground` | light `oklch(0.145 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.card` | light `oklch(1 0 0)` · dark `oklch(0.205 0 0)` |  |
| `shadcn.cardForeground` | light `oklch(0.145 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.popover` | light `oklch(1 0 0)` · dark `oklch(0.205 0 0)` |  |
| `shadcn.popoverForeground` | light `oklch(0.145 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.primary` | `#fec089` |  |
| `shadcn.primaryForeground` | `#060606` |  |
| `shadcn.primaryHover` | `#ebdccf` | The dashboard's hover peach. Marketing used #fdd4aa and repaints. |
| `shadcn.primaryBronze` | `#8c6b47` |  |
| `shadcn.primaryGold` | `#e8c260` |  |
| `shadcn.primaryRgb` | `254, 192, 137` |  |
| `shadcn.secondary` | light `oklch(0.97 0 0)` · dark `oklch(0.269 0 0)` |  |
| `shadcn.secondaryForeground` | light `oklch(0.205 0 0)` · dark `oklch(0.985 0 0)` | The neutral on-secondary label: shadcn's own semantics, and the dashboard's. Marketing used this name for a brand-peach label instead, which is a different role, not a different value — see secondaryForegroundAccent. |
| `shadcn.secondaryForegroundAccent` | light `#89684a` · dark `#fec089` | A brand-peach label on the secondary chip. Marketing's meaning for --secondary-foreground, given its own name so both roles survive: the dashboard puts a neutral near-black label on a light secondary button, marketing puts a peach one on a dark chip. Same name, two roles — the same trap as chrome.* vs surface.*. Values track color.brand.peach per mode; 9.45:1 dark, 4.65:1 light. |
| `shadcn.muted` | light `oklch(0.97 0 0)` · dark `oklch(0.269 0 0)` |  |
| `shadcn.mutedForeground` | light `oklch(0.538 0 0)` · dark `oklch(0.708 0 0)` | Light darkened from shadcn's stock oklch(0.556 0 0), which is 4.35:1 on muted and fails AA. Darkened again in 0.5.2, from oklch(0.546 0 0) to oklch(0.538 0 0): 0.546 was the least-darkened value clearing 4.5:1 ON MUTED, and it was never checked against `card`, where it measures 4.49:1 and fails. That produced 42 contrast failures across the marketing site, in every component putting quiet text on a card — a breadcrumb, a table caption, a figure label. 0.538 clears 4.64:1 on card and more on muted, which is lighter. Same mistake the semantic *OnTint tokens made in 0.5.1: derived against one ground, shipped onto several. |
| `shadcn.accent` | light `oklch(0.97 0 0)` · dark `oklch(0.269 0 0)` |  |
| `shadcn.accentForeground` | light `oklch(0.205 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.destructive` | `oklch(0.656 0.198 28.1)` | Invariant, matching the dashboard, and exactly color.semantic.errorRed (#f25246) — the two were the same colour under two names. Marketing mode-split it per upstream shadcn and repaints. Note this LOWERS light-mode contrast against a white label from 4.77:1 to 3.46:1; both modes are now KNOWN_GAPS under D5, whose fix is a single design call on the fill instead of two unrelated reds. |
| `shadcn.destructiveForeground` | `#ffffff` | White, invariant. 4.77:1 on the light destructive; 2.89:1 on the dark one, which is a KNOWN_GAP in the contrast gate. The fix is to darken --destructive in dark, not this: shadcn's dark destructive is a light red picked to be legible as *text*, and both Button implementations then paint it as a fill via `bg-destructive text-destructive-foreground`. Darkening the label instead was tried and made the label invisible in the marketing gallery. Changing the fill is a visible design call across both apps. |
| `shadcn.border` | light `oklch(0.922 0 0)` · dark `oklch(1 0 0 / 10%)` |  |
| `shadcn.input` | light `oklch(0.922 0 0)` · dark `oklch(1 0 0 / 15%)` |  |
| `shadcn.ring` | light `oklch(0.708 0 0)` · dark `oklch(0.556 0 0)` |  |
| `shadcn.chart1` | light `oklch(0.646 0.222 41.116)` · dark `oklch(0.488 0.243 264.376)` |  |
| `shadcn.chart2` | light `oklch(0.6 0.118 184.704)` · dark `oklch(0.696 0.17 162.48)` |  |
| `shadcn.chart3` | light `oklch(0.398 0.07 227.392)` · dark `oklch(0.769 0.188 70.08)` |  |
| `shadcn.chart4` | light `oklch(0.828 0.189 84.429)` · dark `oklch(0.627 0.265 303.9)` |  |
| `shadcn.chart5` | light `oklch(0.769 0.188 70.08)` · dark `oklch(0.645 0.246 16.439)` |  |
| `shadcn.sidebar` | light `oklch(0.985 0 0)` · dark `oklch(0.205 0 0)` |  |
| `shadcn.sidebarForeground` | light `oklch(0.145 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.sidebarAccent` | light `oklch(0.97 0 0)` · dark `oklch(0.269 0 0)` |  |
| `shadcn.sidebarAccentForeground` | light `oklch(0.205 0 0)` · dark `oklch(0.985 0 0)` |  |
| `shadcn.sidebarBorder` | light `oklch(0.922 0 0)` · dark `oklch(1 0 0 / 10%)` |  |
| `shadcn.sidebarRing` | light `oklch(0.708 0 0)` · dark `oklch(0.556 0 0)` |  |
| `shadcn.sidebarPrimary` | light `oklch(0.205 0 0)` · dark `#fec089` | Was oklch(0.488 0.243 264.376), shadcn's default blue. Now brand peach in dark. |
| `shadcn.sidebarPrimaryForeground` | light `oklch(0.985 0 0)` · dark `#060606` | Inverts with sidebarPrimary. Light keeps shadcn's near-white on the near-black sidebarPrimary; dark needs near-black because sidebarPrimary is now brand peach, and the inherited near-white sat on it at 1.55:1. |
| `shadcn.switchThumb` | `oklch(1 0 0)` |  |
| `shadcn.tooltipBorder` | light `#1f2937` · dark `oklch(1 0 0 / 0.3)` |  |
| `shadcn.warning` | `#edc29c` | Legacy peach, matching the dashboard. Marketing had brand peach #fec089 here, which collapsed the brand/legacy distinction the token file has always drawn. |

<!-- @tokens:generated:end -->

<!-- @templates:generated:start -->

> Also frozen, and **none of these six templates ship in this package**. They
> are skene-dashboard components under `components/workspace/templates/`; see
> the header note in `machine/layouts.yaml`. "Phase B" / "Phase C" refer to that
> repo's plan, not to anything tracked here.

| Template | Spec kind | Status | Slots | Tokens consumed |
|---|---|---|---|---|
| `<CanvasTemplate>` | `canvas` | passthrough (Phase B; chrome extraction queued for Phase C) | `spec`, `children` | — |
| `<DashboardTemplate>` | `dashboard` | passthrough (Phase B; chrome extraction queued for Phase C) | `spec`, `children` | — |
| `<DetailTemplate>` | `detail` | passthrough (Phase B; chrome extraction queued for Phase C) | `spec`, `children` | — |
| `<ListTemplate>` | `list` | active | `spec`, `actions?`, `toolbar?`, `breadcrumb?`, `children` | — |
| `<SettingsTemplate>` | `settings` | passthrough (Phase B; chrome extraction queued for Phase C) | `spec`, `children` | — |
| `<WizardTemplate>` | `wizard` | passthrough (Phase B; chrome extraction queued for Phase C) | `spec`, `children` | — |

<!-- @templates:generated:end -->

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