---
"@skene/design-system": patch
---

Add the agent entry point the contracts never had.

`machine/` has shipped ~7,000 lines of machine-readable contracts since
2026-08-13, pointed at only by README prose. That works for an agent reading
top-down and does nothing for one that lands in the directory, looks for
`AGENTS.md`, finds nothing and starts guessing. The contracts were readable and
undiscoverable, which is most of the way to not existing.

- `AGENTS.md` at the root, shipped in the tarball, with installation,
  configuration and usage — the three sections Vercel's agent-readability spec
  asks for at least two of. Configuration carries the Turbopack `@source` gap,
  because that one shipped a zero-height `LogoRow` with no error.
- `llms.txt` as the machine-readable index.
- `CLAUDE.md` as a symlink, not a copy: two files saying the same thing are two
  files that disagree by next quarter.
- `__tests__/agent-entry-point.test.ts` gates all of it — every path named in
  either entry point must resolve, every contract in `machine/` must be named in
  both, `context.yaml` must be listed before the others (its siblings' headers
  say to read it first), and every code fence must carry a language.

Two stale claims fixed while verifying, both in documents an agent is told to
trust: the README said the package "has 79 modules" (89) and that the gallery
renders "all 79 modules as 85 cases". The second was wrong in the way that
matters — it claimed complete coverage when ten modules have no case at all,
and those ten are exactly the ones `machine/context.yaml` marks `seen: []` and
tells an agent to treat as unproven. Now gated too.

The site half of that spec — sitemap.xml, sitemap.md, robots.txt, canonical
links, JSON-LD, markdown mirrors, content negotiation — is about serving pages
over HTTP and belongs to `docs-app`. Not attempted here.
