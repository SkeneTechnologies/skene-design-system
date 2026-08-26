/**
 * Barrel. Deliberately NOT marked "use client".
 *
 * A directive here would poison every primitive, including the ones that are
 * server-renderable (Card, Badge, Table, Alert). Each module carries its own
 * directive, so `import { Card } from '@skene/design-system'` stays a server
 * component while `import { Dialog }` draws the client boundary at exactly that
 * one file. For the tightest boundary inside RSC, deep-import instead:
 * `@skene/design-system/ui/dialog`.
 */
export * from './ui/accordion.js';
export * from './ui/alert.js';
export * from './ui/alert-dialog.js';
export * from './ui/badge.js';
export * from './ui/breadcrumb.js';
export * from './ui/button.js';
export * from './ui/card.js';
export * from './ui/checkbox.js';
export * from './ui/collapsible.js';
export * from './ui/command.js';
export * from './ui/dialog.js';
export * from './ui/dropdown-menu.js';
export * from './ui/hover-card.js';
export * from './ui/input.js';
export * from './ui/input-group.js';
export * from './ui/label.js';
export * from './ui/navigation-menu.js';
export * from './ui/popover.js';
export * from './ui/progress.js';
export * from './ui/select.js';
export * from './ui/settings-field.js';
export * from './ui/sheet.js';
export * from './ui/skeleton.js';
export * from './ui/slider.js';
export * from './ui/sonner.js';
export * from './ui/switch.js';
export * from './ui/table.js';
export * from './ui/tabs.js';
export * from './ui/textarea.js';
export * from './ui/tooltip.js';
export * from './patterns/hero-backdrop.js';
export * from './patterns/terminal.js';
export * from './patterns/dither.js';
export * from './patterns/marketing.js';
/**
 * Sections are compositions, not primitives: a whole band of a marketing page
 * rather than a control. They live apart from `patterns/` because they carry
 * layout and an editorial argument, and a consumer usually wants one or two
 * rather than the set.
 */
export * from './sections/agent-callout.js';
export * from './sections/faq-band.js';
export * from './sections/recommendation-card.js';
export * from './sections/score-ring.js';
export * from './sections/surface-cards.js';
export * from './sections/surface-tiles.js';
export * from './sections/terminal-block.js';
export * from './sections/glyph-badge.js';
export * from './sections/traffic-lights.js';
export * from './sections/chip.js';
export * from './sections/code.js';
export * from './sections/product-window.js';
export * from './sections/finding-card.js';
export * from './sections/feature-row.js';
export * from './sections/section-backdrop.js';
export * from './sections/check-list.js';
export * from './sections/plan-card.js';
export * from './sections/billing-toggle.js';
export * from './sections/final-cta.js';
export * from './sections/footer.js';
export * from './sections/pipeline-stepper.js';
export * from './sections/ask-widget.js';
export * from './sections/annotated-curve.js';
export * from './sections/light-section-card.js';
export * from './sections/stat-chip.js';
export * from './sections/bridge.js';
export * from './sections/journey-track.js';
export * from './sections/value-cards.js';
export * from './sections/question-grid.js';
export * from './sections/trust-panel.js';
export * from './sections/comparison-table.js';
export * from './sections/logo-row.js';
export * from './sections/team-card.js';
// The marketing artifacts. Ported from the prototype site, where they existed
// as HTML in a generator and 783 lines of app-local CSS. They live here rather than
// in skene-site because they ARE the marketing surface's visual language and
// this package is its source of truth; every one of them mapped to nothing
// that already existed, which is `ask_first_when:
// a_needed_primitive_or_pattern_does_not_exist`, and the founder chose the
// package over app-local copies on 2026-08-12.
export * from './sections/artifact-shell.js';
export * from './sections/pr-review.js';
export * from './sections/side-by-side-diff.js';
export * from './sections/discovery-table.js';
export * from './sections/funnel.js';
export * from './sections/key-value-table.js';
export * from './sections/evaluator-list.js';
export * from './sections/evaluator-check.js';
export * from './sections/evaluator-verify.js';
export * from './sections/evaluator-panel.js';
export * from './sections/lifecycle-canvas.js';
export * from './sections/mcp-block.js';
export * from './sections/integration-rows.js';
export * from './sections/overview-tiles.js';
export * from './sections/flow-diagram.js';
export * from './sections/card-animation-integrations.js';
export * from './sections/integrations-highlight.js';
export * from './sections/journey-signal-scene.js';
