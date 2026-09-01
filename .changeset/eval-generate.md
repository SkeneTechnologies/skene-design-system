---
"@skene/design-system": minor
---

feat(evals): generate candidates by handing an agent DESIGN.md and nothing else

`npm run eval` scored candidates; every one was hand-written, so the loop
measured the scorer rather than a model. `npm run eval:generate` closes it.

**The agent gets `DESIGN.md` and one tool, not a context dump.** Pasting the
tree into the prompt would measure whether a big pile of docs works and prove
nothing about the split the tree exists for. `read_design_file` resolves nothing
outside `DESIGN.md` and `design/` — no `machine/*.yaml`, no source, no gallery.
That restriction is the experiment: it puts the model in the position of an
agent in someone else's editor with a URL and no checkout, which is the reader
`DESIGN.md` was built for and the one nothing had ever tested.

**The retrieval trace is the finding.** Every path opened is recorded, so a run
answers what no other gate here can: which files an agent reaches for and in
what order, how many it needs before it can build a page (the routing table in
`DESIGN.md` claims one or two), and which paths it tries that do not exist — a
miss being the docs implying a file that was never generated. Each candidate
lands beside a sidecar carrying model, effort, turns, token usage, a dollar
estimate and the trace.

Claude Opus 5 with adaptive thinking, streamed, with the stable prefix
(`DESIGN.md` plus the tree listing) cached across cases and repeats. `--dry-run`
prints the plan and the full prompt without calling anything; credentials come
from the environment or an `ant auth login` profile and are never prompted for.

Runs write to `evals/runs/<stamp>/`, which git ignores — never to
`candidates/`, where a generated file would turn a finding about the model into
a red build. Scoring a run takes `--measure`, which reports without enforcing
the `bad-*` fixture convention a generated candidate makes no claim about.

**Not yet run against a model.** This environment has no API key, so no
candidate has been generated and no trace collected. What is tested is the part
that can be: the path sandbox against traversal, symlinks and contract-file
escapes; the fence stripper, because a fence in the output would hide every
import from the scorer and read as a page that imported nothing; and the tool
schema. The first real run is the first real measurement, and may well find the
harness needs adjusting before the design system does.
