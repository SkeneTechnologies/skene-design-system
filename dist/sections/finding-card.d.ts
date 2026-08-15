import { type Status } from '../lib/status.js';
/**
 * The audit primitives: a headline metric, its trend, and the per-step findings
 * that contradict it.
 *
 * These carry Skene's actual argument — a dashboard reports a healthy number
 * while individual journey steps are unmeasured or renamed — so the status
 * vocabulary is fixed rather than free-form. `good | warn | danger` binds to
 * `semantic.matcha / warningAmber / errorRed`, the same three the dashboard
 * uses. The captured demo had invented its own mint and salmon; snapping them
 * was the point of the token reconciliation, because a marketing page and a
 * product that disagree about what "broken" looks like teach the reader the
 * wrong colour.
 *
 * All content is props. Nothing here knows what a Skene finding says.
 */
export type FindingStatus = Status;
export interface FindingProps {
    status: FindingStatus;
    /** Short uppercase tag — the step number, or a state like "GAP". */
    tag: React.ReactNode;
    title: React.ReactNode;
    /** The consequence. Optional, but a finding without one rarely earns its row. */
    note?: React.ReactNode;
    /** `true` renders for a light ProductWindow (the default frame). */
    onLight?: boolean;
    className?: string;
}
export declare function Finding({ status, tag, title, note, onLight, className }: FindingProps): import("react").JSX.Element;
export interface MetricCardProps {
    label: React.ReactNode;
    value: React.ReactNode;
    /** Signed delta, e.g. "↓ 8.2%". Coloured by `trend`. */
    delta?: React.ReactNode;
    trend?: FindingStatus;
    className?: string;
    children?: React.ReactNode;
}
/**
 * The big number. Deliberately `font-weight: 400` at 2.6rem — the captured demo
 * sets display numerals light and tight, and bolding them makes the page read
 * like a dashboard rather than an argument about one.
 */
export declare function MetricCard({ label, value, delta, trend, className, children }: MetricCardProps): import("react").JSX.Element;
export interface SparklineProps {
    /** Bar heights as percentages, 0-100. */
    bars: number[];
    /** Index of the bar to pick out in brand peach — usually where the drop starts. */
    highlight?: number;
    className?: string;
}
/**
 * A bar sparkline with one bar called out.
 *
 * Not a chart: there are no axes, no scale, and the values are authored rather
 * than measured. It exists to make a shape legible at a glance inside a section,
 * which is why `highlight` is an index and not a threshold — the copy decides
 * which bar matters, not the data.
 */
export declare function Sparkline({ bars, highlight, className }: SparklineProps): import("react").JSX.Element;
//# sourceMappingURL=finding-card.d.ts.map