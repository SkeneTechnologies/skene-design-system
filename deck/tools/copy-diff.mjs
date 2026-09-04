/* Extracts every visible word from the rendered deck and word-diffs it against
   copy.txt. Slide numbers and the deck's own nav hint are dropped as functional
   UI text; everything else is reported. */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const deck = resolve(here, '..')
const currency = process.argv[2] || 'EUR'

const norm = s => s
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/·/g, '·').replace(/–/g, '–')
  .replace(/\s+/g, ' ').trim()

const words = s => norm(s).split(' ').filter(Boolean)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
await page.goto('file://' + resolve(deck, 'index.html') + '?currency=' + currency)
await page.waitForTimeout(300)
const rendered = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('.slide').forEach(s => {
    const clone = s.cloneNode(true)
    clone.querySelectorAll('.slide-no').forEach(n => n.remove())
    clone.style.display = 'block'
    document.body.appendChild(clone)
    out.push(clone.innerText)
    clone.remove()
  })
  return out.join('\n')
})
await browser.close()

/* copy.txt, with the "## n." section numbering (a document convention, not
   deck copy) reduced to the heading text the deck renders as its eyebrow. */
const copy = readFileSync(resolve(deck, 'copy.txt'), 'utf8')
  .split('\n').map(l => l.replace(/^##\s*\d+\.\s*/, '')).join('\n')

const A = words(copy), B = words(rendered)
/* `--loose` folds the two differences a slide layout legitimately makes to a
   running sentence: a word that becomes a label loses its trailing comma,
   colon, full stop or parenthesis, and an eyebrow or column head is set in
   caps. Nothing else is folded. */
const loose = process.argv.includes('--loose')
const lc = a => loose
  ? a.toLowerCase().replace(/^[("']+|[.,:;)"']+$/g, '')
  : a.toLowerCase()

/* LCS over lowercased words. */
const n = A.length, m = B.length
const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
for (let i = n - 1; i >= 0; i--)
  for (let j = m - 1; j >= 0; j--)
    dp[i][j] = lc(A[i]) === lc(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])

const ops = []
let i = 0, j = 0
while (i < n && j < m) {
  if (lc(A[i]) === lc(B[j])) { i++; j++ }
  else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push(['-', A[i++]])
  else ops.push(['+', B[j++]])
}
while (i < n) ops.push(['-', A[i++]])
while (j < m) ops.push(['+', B[j++]])

/* Group adjacent ops into runs so the report reads as phrases. */
const runs = []
for (const [k, w] of ops) {
  const last = runs[runs.length - 1]
  if (last && last[0] === k) last[1].push(w)
  else runs.push([k, [w]])
}
console.log(`currency: ${currency}`)
console.log(`copy words: ${n}   rendered words: ${m}   common: ${dp[0][0]}`)
if (!runs.length) console.log('\nno differences')
for (const [k, ws] of runs) console.log(`${k} ${ws.join(' ')}`)
