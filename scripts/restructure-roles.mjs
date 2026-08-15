#!/usr/bin/env node
/**
 * One-shot migration: split the overloaded surface/text tokens into two roles.
 *
 * `surface.*` and `text.*` meant two different things in the two consuming apps:
 *
 *   skene-dashboard          fixed dark chrome. globals.css calls them "dark
 *                            ladder, always dark regardless of theme" and "text
 *                            (paired with dark surfaces)". A panel stays dark on
 *                            a light page, the way a terminal does.
 *   skene-marketing-website  theme-aware page surfaces, inverted to a zinc
 *                            ladder in light mode.
 *
 * Same names, incompatible semantics. Making them mode-aware flipped the
 * dashboard's chrome to light and dropped 8 fg/bg pairs below the WCAG floor;
 * leaving them invariant means the marketing site has no light mode. Neither
 * app can be right while they share a name.
 *
 * So both roles exist here, distinctly:
 *
 *   color.chrome.surface.*   invariant dark   <- the dashboard's meaning
 *   color.chrome.text.*      invariant        <- the dashboard's meaning
 *   color.surface.*          $modes           <- the marketing meaning
 *   color.text.*             $modes           <- the marketing meaning
 *
 * They share their dark values and diverge only in light, which is why the
 * ambiguity survived this long. Each app migrates its own call sites on its own
 * schedule; nothing has to change on the day this lands.
 *
 * Run once: node scripts/restructure-roles.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const PATH = new URL('../design-tokens.json', import.meta.url)
const d = JSON.parse(readFileSync(PATH, 'utf8'))

/** The zinc inversion already shipping in skene-marketing-website's light block. */
const LIGHT = {
  surface: {
    '0': '#fafafa', '1': '#f4f4f5', '2': '#ececef', '3': '#d4d4d8',
    midGray: '#e7e7ea', deep: '#f0f0f0', deep2: '#e9e9e9',
    elevated: '#e4e4e7', border: '#e4e4e7',
    // No light value ever existed for `darker`; it is near-black chrome. Keep
    // it dark in both modes rather than inventing one.
    darker: '#060606',
  },
  text: {
    primary: '#0a0a0a', muted: '#525252',
    mutedStrong: 'rgba(0, 0, 0, 0.7)', mutedWeak: 'rgba(0, 0, 0, 0.55)',
    gray: '#4b5563', grayLight: '#6b7280',
    // Brand-tinted, reads on either ground.
    goldSoft: null,
  },
}

const chrome = { surface: {}, text: {} }
const themed = { surface: {}, text: {} }

for (const group of ['surface', 'text']) {
  for (const [key, node] of Object.entries(d.color[group])) {
    const dark = node.$value
    if (typeof dark !== 'string') {
      throw new Error(`color.${group}.${key} is not a plain $value; migration already ran?`)
    }
    // Chrome keeps exactly today's value, so the dashboard is untouched.
    chrome[group][key] = { $value: dark }

    const light = LIGHT[group][key]
    themed[group][key] =
      light === null || light === undefined
        ? { $value: dark }
        : { $modes: { light, dark } }
  }
}

const rebuilt = {}
for (const [k, v] of Object.entries(d.color)) {
  if (k === 'surface') {
    rebuilt.chrome = chrome
    rebuilt.surface = themed.surface
  } else if (k === 'text') {
    rebuilt.text = themed.text
  } else {
    rebuilt[k] = v
  }
}
d.color = rebuilt
d.version = '2.1.0'
d.lastUpdated = '2026-08-11'

writeFileSync(PATH, JSON.stringify(d, null, 2) + '\n')

const modeAware = Object.values(themed).flatMap((g) =>
  Object.values(g).filter((n) => n.$modes),
).length
console.log(`chrome.surface: ${Object.keys(chrome.surface).length}`)
console.log(`chrome.text:    ${Object.keys(chrome.text).length}`)
console.log(`surface/text:   ${Object.keys(themed.surface).length + Object.keys(themed.text).length} (${modeAware} mode-aware)`)
