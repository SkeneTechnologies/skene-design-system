---
"@skene/design-system": patch
---

docs: name the address that already works — the repository is public

`design/` was being routed to `https://www.skene.ai/resources/docs/`, which is
not deployed yet, so every document pointed an agent at a URL that 404s. A
document naming an address that does not answer is worse than one naming none.

The repository is public, and GitHub already serves every file in the tree over
HTTPS with `access-control-allow-origin: *`. Verified, not assumed:

```
200   15,512 bytes  DESIGN.md
200   23,236 bytes  design/index.md
200    8,768 bytes  design/sections/artifact-shell.md
200   10,161 bytes  design/pages/product-page.md
```

That is the whole of "reachable by an agent with no checkout" — no deploy, no
routes, no infrastructure. `DESIGN.md` now names that base beside the canonical
origin and says the paths are identical: swap the base, keep the path.

Derived from `repository.url`, not typed, so it cannot drift from the repo it
points at; a test asserts the emitted base matches the manifest. The three route
handlers and the canonical origin stay — that is where this moves when the docs
app is deployed, and nothing about it needs to change when it is.
