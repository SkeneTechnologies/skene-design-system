/**
 * A documented exception to `machine/rules.yaml`'s `styled_components_for_new_features`.
 *
 * This scene was ported in from skene-marketing-website, where it predates the
 * package's Tailwind port and carries a real history: it was once rebuilt on
 * this package's own primitives (`MiniFunnel`, `AppPanel`, `DiffColumn`,
 * `PrReview` stood in for its three panels), and the founder rejected that
 * version on sight and restored this one. "Produced correct components and a
 * dead band: two panels that swapped wholesale, no ambient context, no
 * connectors, one fade on entry." The entry/reveal choreography, the
 * per-layout absolute positioning, and the connector paths are load-bearing
 * for how it reads, not incidental styling, which is why it stayed on
 * styled-components instead of being re-tried against the rule a second time.
 * See `documentation/20260825_journey_signal_scene_design.md`.
 *
 * Kept as its own island rather than converted: importing this file does not
 * pull styled-components into anything else in the package, since nothing
 * else here uses it.
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
 */
import React from "react";
export declare function JourneySignalScene(): React.JSX.Element;
export default JourneySignalScene;
//# sourceMappingURL=journey-signal-scene.d.ts.map