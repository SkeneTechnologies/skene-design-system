---
"@skene/design-system": patch
---

`sections/journey-signal-scene` now declares `applies-dark` polarity explicitly (`<section className="dark jss">`) instead of falling through to `inherits`. It was never actually theme-adaptive: every ink value it paints is a literal cream-on-dark value with no light-mode translation, so `inherits` was the absence of a decision, not a real one. Placing it on a light page previously rendered its connectors and roughly half its text as cream-on-cream at ~0.55 alpha — present in the DOM, invisible on screen. No API change; consumers that already render it on a dark ground see no visual difference.
