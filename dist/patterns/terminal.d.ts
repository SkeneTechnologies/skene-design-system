export interface TerminalProps {
    /** Shown in the title bar next to the traffic lights. */
    title?: string;
    className?: string;
    children: React.ReactNode;
}
/**
 * A terminal / code frame.
 *
 * Skene's product is a CLI and a GitHub check, so a terminal frame appears on
 * product pages, docs and onboarding across both apps. Having one here stops
 * each surface hand-rolling its own traffic lights.
 *
 * Colours come from `color.terminal.*` and `color.terminal-chrome.*`, which are
 * mode-invariant on purpose: a terminal that turns white in light mode stops
 * reading as a terminal. The chrome styling lives in styles/effects.css as
 * `.skene-terminal`, so the same frame is available to consumers who want the
 * look without importing a component.
 */
export declare function Terminal({ title, className, children }: TerminalProps): import("react").JSX.Element;
export interface TerminalLineProps {
    /** Renders the `$` prompt. Output lines omit it. */
    prompt?: boolean;
    className?: string;
    children: React.ReactNode;
}
export declare function TerminalLine({ prompt, className, children }: TerminalLineProps): import("react").JSX.Element;
//# sourceMappingURL=terminal.d.ts.map