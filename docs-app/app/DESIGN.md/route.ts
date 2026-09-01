/**
 * DESIGN.md at the path an agent guesses. It also ships in the tarball — it is
 * 3.7k tokens and it is the map, so an offline consumer keeps the orienting
 * file and the pointer to the served tree. The 144k tree behind it does not
 * ship; see `app/design/[...path]/route.ts`.
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const dynamic = 'force-static'

export async function GET() {
  const body = await readFile(resolve(process.cwd(), '..', 'DESIGN.md'), 'utf8')
  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}
