/**
 * Serve the design tree, which is why it is no longer in the npm tarball.
 *
 * `machine/*.yaml` and `design/` are the same facts for two different readers.
 * An agent with the checkout should grep the YAML — it is the authority and it
 * is searchable. An agent with a URL and no checkout has neither, and this tree
 * exists for it. Shipping both to every consumer meant every install carried
 * ~144k tokens of a surface most of them would never open, which is the whole
 * of the "the tree is bigger than the YAML it mirrors" complaint.
 *
 * So: the YAML ships, the tree is served. Nobody holds both.
 *
 * Read-only, path-checked, and CORS-open on purpose — an agent fetching this
 * from another origin is the entire point.
 */
import { readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'

/** The package root, two levels above docs-app/app. */
const PKG = resolve(process.cwd(), '..')
const TREE = resolve(PKG, 'design')

export const dynamic = 'force-static'

const HEADERS = {
  'content-type': 'text/markdown; charset=utf-8',
  'access-control-allow-origin': '*',
  'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
}

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  // Resolve first, then judge. A `..` segment and a symlink both have to fail
  // on where they LAND, not on how they are spelled.
  const abs = resolve(TREE, ...path)
  if (relative(TREE, abs).startsWith('..') || !abs.endsWith('.md')) {
    return new Response('Not found\n', { status: 404, headers: { 'content-type': 'text/plain' } })
  }
  try {
    return new Response(await readFile(abs, 'utf8'), { headers: HEADERS })
  } catch {
    return new Response('Not found\n', { status: 404, headers: { 'content-type': 'text/plain' } })
  }
}
