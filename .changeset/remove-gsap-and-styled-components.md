---
"@skene/design-system": minor
---

Remove `styled-components` and `gsap` from the package.

`sections/journey-signal-scene` was the only module on styled-components. Its 60 styled definitions are a stylesheet now, `styles/journey-signal-scene.css`, imported by `styles/index.css` so a consumer that has wired the package stylesheet already has it. Every declaration is the one the styled block carried; the `$dark` prop is the stage's `data-view` attribute and the other style props are `data-*` attributes.

Both animated modules ran on gsap. The scene's entry reveal is an `IntersectionObserver` and two CSS transitions at the timings the timeline ran. `sections/card-animation-integrations` cycles on a sequence of timed state changes with CSS transitions on the elements that move, at the same durations and curves, and pauses at the next step when it leaves the viewport. It gains a `frame` prop that holds one resting state, for galleries and screenshot baselines.

Consumers that render either module stop shipping gsap, which was a 43 KB gzipped chunk on the routes that did.
