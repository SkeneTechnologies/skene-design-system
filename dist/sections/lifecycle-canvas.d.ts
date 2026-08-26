import { type StatPillStatus } from './artifact-shell.js';
export interface LifecycleMilestoneItem {
    /** The milestone's name, in the reader's own words — "First order received". */
    name: React.ReactNode;
    /** One line on what the milestone means. Optional; most earn one. */
    description?: React.ReactNode;
    /**
     * What the milestone is bound to — a table, an operation, a source. Rendered
     * as a wrapping run of monospace tags, verbatim: these are identifiers the
     * reader is meant to recognise in their own schema.
     */
    bindings?: React.ReactNode[];
}
export interface LifecycleStageItem {
    /**
     * The stage's machine name — the key the product stores it under. Monospace
     * and uppercased by CSS, because it is an identifier rather than a title.
     * Omit it and the caption line disappears.
     */
    key?: React.ReactNode;
    /** The stage's display name — "Discovery", "Expansion". */
    name: React.ReactNode;
    /** One line on what the stage covers. */
    description?: React.ReactNode;
    /**
     * The milestones in this stage, in reading order. The prototype's capture has
     * exactly one per stage; the layout takes any number and shares the column's
     * remaining height between them, so a stage with three is not a special case.
     */
    milestones?: LifecycleMilestoneItem[];
}
export interface LifecycleCanvasProps {
    /** The stages, left to right. Order is meaningful — this renders as an `<ol>`. */
    stages: LifecycleStageItem[];
    /** The current surface, rendered bold as the leading breadcrumb segment. */
    title?: React.ReactNode;
    /** What the lifecycle belongs to — a repository, workspace or project. */
    source?: React.ReactNode;
    /**
     * Breadcrumb separator. A glyph rather than a word, but still a prop: a
     * right-to-left page wants a different one.
     */
    separator?: React.ReactNode;
    /**
     * The headline count in the bar's pill — "5 stages". Omit it and the pill
     * disappears.
     */
    summary?: React.ReactNode;
    /**
     * Colour of that pill. Defaults to `ok`: unlike the discovery scan, a
     * lifecycle that renders is a lifecycle that was defined, and there is nothing
     * here for it to be alarmed about.
     */
    summaryStatus?: StatPillStatus;
    /** Anything further in the bar's right cluster — at most one button. */
    actions?: React.ReactNode;
    className?: string;
}
export declare function LifecycleCanvas({ stages, title, source, separator, summary, summaryStatus, actions, className, }: LifecycleCanvasProps): import("react").JSX.Element;
//# sourceMappingURL=lifecycle-canvas.d.ts.map