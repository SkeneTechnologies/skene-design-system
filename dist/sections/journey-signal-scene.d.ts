/**
 * Evidence, a traced journey step, and the PR review that catches it breaking,
 * in one composition with a GTM/Engineering toggle.
 *
 * ## Plain CSS since 2026-09-02, and why it was styled-components before
 *
 * This scene was ported in from skene-marketing-website, where it predates the
 * package's Tailwind port and carries a real history: it was once rebuilt on
 * this package's own primitives (`MiniFunnel`, `AppPanel`, `DiffColumn`,
 * `PrReview` stood in for its three panels), and the founder rejected that
 * version on sight and restored this one. "Produced correct components and a
 * dead band: two panels that swapped wholesale, no ambient context, no
 * connectors, one fade on entry." The entry/reveal choreography, the
 * per-layout absolute positioning, and the connector paths are load-bearing
 * for how it reads, not incidental styling. That is why it arrived on
 * styled-components as a documented exception to `machine/rules.yaml`'s
 * `styled_components_for_new_features`, and stayed that way for a week; see
 * `documentation/20260825_journey_signal_scene_design.md`.
 *
 * The exception is closed. The rejection was about the composition changing,
 * not about the styling library, so the styled definitions were ported 1:1 to
 * `styles/journey-signal-scene.css` (issue #24): same declarations, same
 * numbers, with the props that drove a style (`$dark`, `$active`, `$tone`...)
 * as `data-*` attributes and the numbers a prop computed as inline styles. The
 * stylesheet ships through `styles/index.css`, so a consumer that has wired
 * the package stylesheet has it. gsap went in the same change: the entry
 * reveal is an IntersectionObserver and two CSS transitions now, at the
 * timings the timeline ran. Nothing in the package depends on either library
 * any more.
 *
 * One file, not three, unlike its skene-marketing-website source
 * (index.tsx/styles.ts/data.ts). Every other module in `src/sections` is a
 * single flat file, and both `scripts/build-inventory.mjs` and
 * `scripts/check-story-coverage.mjs` scan `src/sections` non-recursively for
 * `.tsx` files — a subfolder or a sibling `.ts` file is invisible to both, not
 * merely unconventional. The content block right below the imports is kept
 * separate from the styled-components definitions further down for the same
 * reason `data.ts` existed: edit the exported consts in that block for
 * different labels without touching the rest of the file.
 *
 * ## Re-synced from the source 2026-09-02
 *
 * The port above happened on 2026-08-25 and then the two copies drifted, in one
 * direction: skene-marketing-website put six more commits into its copy and this
 * file got none of them. Anything else consuming this section was rendering a
 * stale scene, and the drift was invisible from either side.
 *
 * What arrived with the re-sync:
 *
 *   TWO EVIDENCE SETS instead of one. `EVIDENCE_ENG` and `EVIDENCE_GTM`, on
 *   founder direction 2026-08-26: the panel showed a file path and a table in
 *   BOTH views, which is the engineer's answer handed to a GTM reader who has
 *   no use for it. The scene's whole claim is that one signal has two readings,
 *   and Evidence was the panel not making it. `EvidenceSource` widened from
 *   "code" | "db" to include "metric" and "flow" to carry it.
 *
 *   A COPY CORRECTION, 2026-08-29. "the metric it moves" became "the number it
 *   reports into". The shipped string asserted that the step MOVES the metric,
 *   which is a causal claim the consumer's `voice.md:57` bans, and it
 *   contradicted the panel's own "Feeds" label eight lines away.
 *
 *   A `$dark` prop threaded through several styled components (the
 *   `data-view` attribute on the stage, since the CSS port), and gsap loaded
 *   inside the entry effect rather than at module scope, which is the same
 *   change 0.18.0 made to `CardAnimationIntegrations` for the same reason
 *   (and which the 2026-09-02 change made moot by removing gsap).
 *
 * The two repository-local dependencies the source file carried did not need
 * porting. Its `useContainerScale` is character-for-character this package's
 * `lib/use-container-scale` apart from quoting, and its `media` import from
 * `@/styles/breakpoints` had ZERO uses in the file.
 */
import React from "react";
export declare function JourneySignalScene(): React.JSX.Element;
export default JourneySignalScene;
//# sourceMappingURL=journey-signal-scene.d.ts.map