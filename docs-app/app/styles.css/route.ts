/**
 * The package stylesheet, served. The pattern this tree is modelled on pairs a
 * public design.md with a public stylesheet: the CSS loads in the reader's
 * browser rather than in the model's context, so the token vocabulary costs an
 * agent nothing to USE and only the names have to be documented.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const dynamic = 'force-static'

export async function GET() {
  const pkg = resolve(process.cwd(), '..')
  const [tokens, index] = await Promise.all([
    readFile(resolve(pkg, 'styles/tokens.css'), 'utf8'),
    readFile(resolve(pkg, 'styles/index.css'), 'utf8'),
  ])
  // index.css @imports tokens.css by relative path, which does not resolve
  // over HTTP from another origin. Inline it and drop the import.
  const body = `${tokens}\n${index.replace(/^@import\s+["'][^"']*tokens\.css["'];?\s*$/gm, '')}`
  return new Response(body, {
    headers: {
      'content-type': 'text/css; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}
