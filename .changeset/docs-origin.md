---
"@skene/design-system": patch
---

docs: name the origin the design tree is served from

`design/` stopped shipping in the tarball last change, which left every document
routing an agent to a tree without saying where it is. The origin is now
recorded once, as `designDocs` in the manifest —
`https://www.skene.ai/resources/docs` — and read from there by everything that
names it: `DESIGN.md`'s routing table now gives absolute URLs, `docs-app` derives
its `basePath` from the same field rather than a retyped copy, and `AGENTS.md`
and `llms.txt` name it in full.

Gated two ways. Every entry point must contain the origin, and none may contain
a *different* skene.ai docs path — two documents naming two addresses for one
tree is the same defect as a count quoted twice, except a wrong origin fails as
a 404 in someone else's editor where nobody here will see it. Moving the origin
without regenerating fails both tests.

`DESIGN.md` also now points at the served stylesheet, `styles.css`, with the
reason: load it in the page, do not read it — the class names are documented and
the CSS never needs to enter a model's context.

**Not yet true, and stated here rather than discovered later.** `docs-app` has no
deploy step in this repository — CI builds and tests it and nothing publishes it
— and `www.skene.ai` is, by this repo's own source comments, the live marketing
site, which is a different repository. The routes and the `basePath` are correct
for `docs-app` being deployed behind that path. If the marketing site is to serve
these files instead, the three route handlers need to move there and only the
manifest field stays.
