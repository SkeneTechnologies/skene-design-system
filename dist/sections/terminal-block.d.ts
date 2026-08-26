export interface TerminalBlockLine {
    /**
     * The command, as plain text. This is both what is shown and what reaches the
     * clipboard, which is the point of it being a `string`: what you copy is
     * exactly what you read.
     */
    command: string;
    /**
     * Marked-up alternative for the *visible* text only — the clipboard still gets
     * `command`. The escape hatch for highlighting a flag or dimming a URL without
     * putting markup between the reader and the paste.
     */
    display?: React.ReactNode;
    /**
     * The prompt glyph. Defaults to `$`. Pass `null` for an output line — one that
     * shows what the command printed rather than what to type.
     */
    prompt?: React.ReactNode;
    /** `false` drops the copy button. Output lines rarely want one. */
    copyable?: boolean;
}
export interface TerminalBlockProps {
    lines: TerminalBlockLine[];
    /** Bar label beside the traffic lights — the shell's name, usually. */
    title?: React.ReactNode;
    /** Footnote under a rule. The caveat the commands do not carry themselves. */
    note?: React.ReactNode;
    /** Idle label on the copy button. */
    copyLabel?: React.ReactNode;
    /** Label during the flash, and half of the button's accessible name. */
    copiedLabel?: React.ReactNode;
    /**
     * Fired after every copy attempt, successful or not.
     *
     * The component deliberately shows the reader nothing when the clipboard
     * fails — flashing "copied" for a copy that did not happen is worse than
     * silence. But that silence is only right for the reader. A consumer
     * measuring an install funnel needs the outcome, or it cannot tell "nobody
     * copied" from "the copy button does not work on this origin", and clipboard
     * writes fail routinely on insecure origins and when a user declines the
     * permission.
     *
     * `command` is what actually reached the clipboard, which is not always what
     * is on screen: a line may carry a `display` override.
     */
    onCopy?: (result: {
        command: string;
        index: number;
        ok: boolean;
    }) => void;
    className?: string;
}
/**
 * ## The same frame exists twice, and this one is not the deprecated half
 *
 * `patterns/terminal`'s `Terminal` draws the same object — same tokens, same
 * 10px traffic lights, same mono body — and the two do not match: that frame
 * comes from the `.skene-terminal` class in `effects.css` at an 8px radius,
 * this one draws its own through `ArtPanel` at 12px. Two terminals that
 * disagree is worse than either, and settling them is decision `terminals`.
 *
 * This file carried an `@deprecated` tag for one afternoon on 2026-08-13. That
 * was wrong twice over: the tag means "this will be removed" and the decision
 * was explicitly not to remove it, and it is the only one of the two with a
 * copy affordance — which is the reason `skene-site` renders it on five pages
 * and had just extended it with `onCopy`. A deprecation whose own text tells
 * you to keep using the thing is a deprecation that teaches readers to ignore
 * the tag.
 *
 * Reach for `Terminal` when you want a transcript with no copy button. Reach
 * for this when a reader is meant to run the line.
 */
export declare function TerminalBlock({ lines, title, note, copyLabel, copiedLabel, onCopy, className, }: TerminalBlockProps): import("react").JSX.Element;
//# sourceMappingURL=terminal-block.d.ts.map