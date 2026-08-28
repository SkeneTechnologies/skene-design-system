---
"@skene/design-system": minor
---

assets: ship `skene-tui.gif`, the one design asset that lived in neither repository

571 KB, the terminal UI running. It was under the marketing repo's
`.webanatomy/build-page/_shared/assets/` — wireframe scaffolding, not a served
directory — so the page drawn around it could not reach it. `/developers`'
cream band shipped a `TerminalBlock` of static text instead, with a comment
recording that the asset "lives only under `.webanatomy/_shared` and is not in
`public/`".

That is the cost of an asset stranded outside both repositories: not untidiness,
a visible downgrade on a live page that nobody could fix from either side. The
same consumer also carries eleven files under that directory which are
byte-identical to `assets/` here, kept because the wireframes are static HTML
served by `python -m http.server` and cannot resolve `node_modules`. Shipping
this one closes the gap that had no workaround; the other eleven have one.
