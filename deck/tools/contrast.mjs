/* Every text run in the deck against the package's floors: 4.5:1 body,
   3:1 for large text (>=24px, or >=18.66px bold), per machine/accessibility.yaml. */
import { chromium } from 'playwright'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const deck = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
await p.goto('file://' + resolve(deck, 'index.html'))
await p.addStyleTag({ content: '@media screen{body{display:block}.deck{transform:none}.slide{display:flex!important}}' })
await p.waitForTimeout(400)
const bad = await p.evaluate(() => {
  const px = v => { const m = /rgba?\(([^)]+)\)/.exec(v); if (!m) return null
    const a = m[1].split(',').map(Number); return { r: a[0], g: a[1], b: a[2], a: a.length > 3 ? a[3] : 1 } }
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b) }
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 })
  const bgOf = el => {
    let n = el
    while (n && n !== document.documentElement) {
      const c = px(getComputedStyle(n).backgroundColor)
      if (c && c.a === 1) return c
      n = n.parentElement
    }
    return { r: 10, g: 10, b: 10, a: 1 }
  }
  const out = []
  document.querySelectorAll('.slide *').forEach(el => {
    const own = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())
    if (!own) return
    const cs = getComputedStyle(el)
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400
    const fg = px(cs.color); if (!fg) return
    const bg = bgOf(el)
    const c = over(fg, bg)
    const L1 = lum(c), L2 = lum(bg)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const floor = large ? 3 : 4.5
    if (ratio < floor) out.push({
      slide: el.closest('.slide').id, tag: el.tagName, cls: el.className,
      text: (el.textContent || '').trim().slice(0, 46),
      size, ratio: +ratio.toFixed(2), floor
    })
  })
  return out
})
await b.close()
if (!bad.length) console.log('contrast: every text run clears its floor')
else { console.log(`${bad.length} run(s) under floor:`); bad.forEach(x => console.log(`  ${x.slide} ${x.ratio}:1 < ${x.floor} (${x.size}px) ${x.cls} "${x.text}"`)) }
