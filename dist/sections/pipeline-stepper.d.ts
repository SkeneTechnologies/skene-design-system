/**
 * The progress pipeline shown inside a product window while a long job runs.
 *
 * The connector is owned by the STEPPER, not by the step, and it is filled from
 * the state of the step on its LEFT. That is the whole reason `steps` is an
 * array prop rather than `children`: "filled" is a property of the pair, so a
 * step that drew its own trailing rule would have to know it is not last, and a
 * finished final step would draw a filled rule into empty space. Owning the
 * connectors here makes the row read as one track filling left to right instead
 * of as N independent dots that happen to be in a line.
 *
 * Emphasis runs opposite to the usual instinct: the ACTIVE step carries the
 * label weight and done steps recede. While a job is running the reader's
 * question is "what is it doing now", not "what has it already finished", and
 * bolding the completed steps answers the wrong one.
 *
 * Type uses the theme-aware `text.*` role. This lands inside a LIGHT
 * `ProductWindow` on a cream fill, and `chrome.text.*` is invariant cream by
 * definition — it cannot invert, so it would disappear here. Done uses
 * `semantic.matcha`, the same completion colour the findings use, and `active`
 * uses `brand.peach` so the moving part is the brand colour rather than a
 * second success state.
 *
 * The hairline is the one thing no mode-aware role covers: on cream the correct
 * token is `chrome.line.onLight`, on a dark ground `chrome.line.subtle`. Hence
 * `onLight`, which defaults to `true` because the light window is where this
 * renders.
 *
 * Below `sm` it stacks vertically. Three labelled steps sharing 390px leaves
 * under a third of the width each, which wraps every label to two or three
 * lines. Stacked, the connector rotates — a 1px column instead of a 1px row —
 * rather than being dropped, so the filled track still reads as progress.
 *
 * No `use client`: state arrives as props, so a version that advances over time
 * composes by re-rendering with new props and this file stays
 * server-renderable.
 */
export type PipelineStepState = 'done' | 'active' | 'pending';
export interface PipelineStepItem {
    label: React.ReactNode;
    state: PipelineStepState;
    /** Glyph or icon element inside the ring. Falls back to a check / a dot. */
    icon?: React.ReactNode;
}
export interface PipelineStepProps extends PipelineStepItem {
    /** `true` (default) renders on the cream fill of a light ProductWindow. */
    onLight?: boolean;
    className?: string;
}
export declare function PipelineStep({ label, state, icon, onLight, className }: PipelineStepProps): import("react").JSX.Element;
export interface PipelineStepperProps {
    /** Left to right; the connector after a `done` step renders filled. */
    steps: PipelineStepItem[];
    /** What the job is, e.g. the line the product prints when it starts. */
    title?: React.ReactNode;
    /** One quieter line under the title. */
    subtitle?: React.ReactNode;
    /** `true` (default) renders on the cream fill of a light ProductWindow. */
    onLight?: boolean;
    className?: string;
}
export declare function PipelineStepper({ steps, title, subtitle, onLight, className, }: PipelineStepperProps): import("react").JSX.Element;
//# sourceMappingURL=pipeline-stepper.d.ts.map