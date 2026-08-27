---
"@skene/design-system": patch
---

Ship three Agent Skills, and add `skills/` to the tarball.

`AGENTS.md` only helps an agent that already knows to look for it. A Skill is
routed to by its `description`, on a trigger the agent never went looking for —
which is the moment the contracts are worth reading and the moment they were
being missed. The split is by moment, not by surface, because surface is the
wrong axis here: dashboard visuals render *on* marketing pages, so a
marketing/product split would misroute every artifact section.

- `skills/skene-design-system-setup` — first install, the stylesheet, the
  Tailwind `@source` line and the proof it took. That is the only one of the
  four steps that fails silently, so it is the only one carrying a proof.
- `skills/skene-design-system` — before writing any component. The intent
  vocabulary is inlined rather than pointed at, since an agent that has to open
  `context.yaml` to learn the tags has already paid the cost the reverse index
  exists to avoid.
- `skills/skene-design-system-pages` — composing a whole page: the spine, the
  eight archetypes read confidence-first, and what has no recipe at all.

Each description carries a `Do NOT use for…` clause naming the other two, so
three skills over one package do not fire over each other.

`__tests__/skills.test.ts` gates it. The numbers a skill quotes are compared
against their sources — the inlined intent vocabulary against the 20 tags
`context.yaml` declares, the spine and archetype tables against
`compositions.yaml`'s own counts and confidences — so drift fails rather than
quietly teaching an agent something untrue. Every repo-relative path any skill
names is resolved; consumer-tree paths are deliberately not, since resolving
those against this repo is how a correct instruction gets "fixed" into a wrong
one.

`AGENTS.md` also gains a first-run section, for the agent that lands there
directly rather than being routed.
