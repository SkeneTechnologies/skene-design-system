#!/usr/bin/env node
/**
 * One-shot migration: bring the shadcn semantic slots into the token file.
 *
 * These ~30 custom properties are what every shadcn primitive actually reads —
 * `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`. Until now
 * they were hand-written in *both* apps' globals.css and in neither token file,
 * which is why "the token pipeline is authoritative" was only ever true of the
 * mode-invariant `:root` values, and why flipping the surface ladder alone left
 * every card dark on a light marketing page.
 *
 * Values reconciled from both apps. Where they disagreed:
 *
 *   --Warning            #edc29c / #fec089  -> #fec089, consistent with --primary
 *   --primary-hover      #ebdccf / #fdd4aa  -> #fdd4aa, the peach tint that goes
 *                                              with brand peach rather than the
 *                                              desaturated tan that went with legacy
 *   --primary-rgb        stale in dashboard -> 254,192,137, the rgb of #fec089
 *   --destructive        one value / split  -> mode-split, matching upstream shadcn
 *   --background light   #f4f4f4 / oklch(1) -> oklch(1 0 0), the shadcn default;
 *                                              #f4f4f4 was a local dashboard tweak
 *   --secondary-foreground
 *                        #060606 / #fec089  -> NEITHER. Near-black is unreadable on
 *                                              the dark secondary, peach is
 *                                              unreadable on the light one, so each
 *                                              app was correct only in its own
 *                                              default theme. Normalised to the
 *                                              shadcn pair, which is legible in both.
 *
 * Not brought over: --neon-* and --glow-* (aliases of color.neon.*), --peach
 * (alias of brand.peach), --chat-primary and --Error (app-specific, oddly cased).
 *
 * Run once: node scripts/add-shadcn-slots.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const PATH = new URL('../design-tokens.json', import.meta.url)
const d = JSON.parse(readFileSync(PATH, 'utf8'))

if (d.shadcn) throw new Error('shadcn group already present; migration already ran?')

/** [light, dark] */
const M = (light, dark) => ({ $modes: { light, dark } })
/** same in both modes */
const V = (v) => ({ $value: v })

d.shadcn = {
  $cssPrefix: '',

  background: M('oklch(1 0 0)', 'oklch(0.145 0 0)'),
  foreground: M('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),

  card: M('oklch(1 0 0)', 'oklch(0.205 0 0)'),
  cardForeground: M('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  popover: M('oklch(1 0 0)', 'oklch(0.205 0 0)'),
  popoverForeground: M('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),

  primary: V('#fec089'),
  primaryForeground: V('#060606'),
  primaryHover: V('#fdd4aa'),
  primaryBronze: V('#8c6b47'),
  primaryGold: V('#e8c260'),
  primaryRgb: V('254, 192, 137'),

  secondary: M('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  secondaryForeground: M('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),

  muted: M('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  mutedForeground: M('oklch(0.556 0 0)', 'oklch(0.708 0 0)'),
  accent: M('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  accentForeground: M('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),

  destructive: M('oklch(0.577 0.245 27.325)', 'oklch(0.704 0.191 22.216)'),
  destructiveForeground: V('#ffffff'),

  border: M('oklch(0.922 0 0)', 'oklch(1 0 0 / 10%)'),
  input: M('oklch(0.922 0 0)', 'oklch(1 0 0 / 15%)'),
  ring: M('oklch(0.708 0 0)', 'oklch(0.556 0 0)'),

  chart1: M('oklch(0.646 0.222 41.116)', 'oklch(0.488 0.243 264.376)'),
  chart2: M('oklch(0.6 0.118 184.704)', 'oklch(0.696 0.17 162.48)'),
  chart3: M('oklch(0.398 0.07 227.392)', 'oklch(0.769 0.188 70.08)'),
  chart4: M('oklch(0.828 0.189 84.429)', 'oklch(0.627 0.265 303.9)'),
  chart5: M('oklch(0.769 0.188 70.08)', 'oklch(0.645 0.246 16.439)'),

  sidebar: M('oklch(0.985 0 0)', 'oklch(0.205 0 0)'),
  sidebarForeground: M('oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
  sidebarAccent: M('oklch(0.97 0 0)', 'oklch(0.269 0 0)'),
  sidebarAccentForeground: M('oklch(0.205 0 0)', 'oklch(0.985 0 0)'),
  sidebarBorder: M('oklch(0.922 0 0)', 'oklch(1 0 0 / 10%)'),
  sidebarRing: M('oklch(0.708 0 0)', 'oklch(0.556 0 0)'),
  // Off-brand: this is shadcn's default blue in a peach system, carried
  // identically by both apps. Recorded rather than silently corrected, because
  // changing it is a visible design call, not a migration detail.
  sidebarPrimary: M('oklch(0.205 0 0)', 'oklch(0.488 0.243 264.376)'),
  sidebarPrimaryForeground: V('oklch(0.985 0 0)'),

  switchThumb: V('oklch(1 0 0)'),
  tooltipBorder: M('#1f2937', 'oklch(1 0 0 / 0.3)'),
  warning: V('#fec089'),
}

d.version = '2.2.0'
d.lastUpdated = '2026-08-11'
writeFileSync(PATH, JSON.stringify(d, null, 2) + '\n')

const n = Object.keys(d.shadcn).filter((k) => !k.startsWith('$')).length
const modeAware = Object.values(d.shadcn).filter((v) => v && v.$modes).length
console.log(`added ${n} shadcn slots (${modeAware} mode-aware)`)
