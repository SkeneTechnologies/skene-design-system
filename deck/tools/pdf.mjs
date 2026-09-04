import { chromium } from 'playwright'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { statSync } from 'node:fs'
const deck = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const currency = process.argv[2] || 'EUR'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('file://' + resolve(deck, 'index.html') + '?currency=' + currency)
await p.emulateMedia({ media: 'print' })
await p.waitForTimeout(300)
const out = resolve(deck, `skene-seed-deck-${currency}.pdf`)
await p.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1-' })
await b.close()
console.log(out, statSync(out).size + ' bytes')
