import type { NextConfig } from 'next'

/**
 * The docs app is mounted under a path on the main site, not at a root domain,
 * so every route it serves — including the design tree and the stylesheet —
 * has to be emitted with that prefix. `basePath` does that for links and
 * assets; the value must match `designDocs` in the package manifest, which is
 * the single place the origin is written down and what every document naming
 * it is gated against.
 */
const BASE_PATH = new URL(
  (require('../package.json') as { designDocs: string }).designDocs,
).pathname.replace(/\/$/, '')

const config: NextConfig = {
  basePath: BASE_PATH || undefined,
}

export default config
