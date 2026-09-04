/* Renders every slide to a 1920x1080 PNG and reports overflow / clipping. */
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdirSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const deck = resolve(here, '..')
const out = resolve(deck, 'shots')
mkdirSync(out, { recursive: true })

const currency = process.argv[2] || 'EUR'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
await page.goto('file://' + resolve(deck, 'index.html') + '?currency=' + currency)
await page.addStyleTag({ content: '@media screen{body{display:block}.deck{transform:none}}' })
await page.waitForTimeout(300)

const n = await page.evaluate(() => document.querySelectorAll('.slide').length)
let bad = 0
for (let i = 0; i < n; i++) {
  await page.evaluate(i => {
    document.querySelectorAll('.slide').forEach((s, k) => s.classList.toggle('is-active', k === i))
  }, i)
  await page.waitForTimeout(60)
  const report = await page.evaluate(() => {
    const slide = document.querySelector('.slide.is-active')
    const box = slide.getBoundingClientRect()
    const problems = []
    if (slide.scrollHeight > slide.clientHeight + 1) problems.push(`slide scrollHeight ${slide.scrollHeight} > ${slide.clientHeight}`)
    if (slide.scrollWidth > slide.clientWidth + 1) problems.push(`slide scrollWidth ${slide.scrollWidth} > ${slide.clientWidth}`)
    slide.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) return
      if (r.bottom > box.bottom + 1 || r.top < box.top - 1 || r.right > box.right + 1 || r.left < box.left - 1) {
        problems.push(`outside frame: ${el.tagName}.${el.className} @ ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`)
      }
      if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflowY !== 'visible') {
        problems.push(`clipped: ${el.tagName}.${el.className} ${el.scrollHeight}>${el.clientHeight}`)
      }
    })
    return { id: slide.id, problems: [...new Set(problems)] }
  })
  await page.screenshot({ path: `${out}/${String(i + 1).padStart(2, '0')}-${report.id}-${currency}.png` })
  if (report.problems.length) {
    bad++
    console.log(`\n${report.id}:`)
    report.problems.slice(0, 12).forEach(p => console.log('   ' + p))
  }
}
console.log(bad ? `\n${bad} slide(s) with problems` : `\nall ${n} slides clean (${currency})`)
await browser.close()
