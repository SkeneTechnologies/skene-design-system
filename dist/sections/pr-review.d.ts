/**
 * The GitHub pull-request review artifact: the bot's comment on a PR, drawn
 * rather than screenshotted.
 *
 * ## One component, two reviews
 *
 * The prototype carries this twice — a failing review with a title, a status
 * line, an issue list and a "How to fix" section, and a passing one that is a
 * single sentence. They are not two artifacts. They are the same chrome, the
 * same bot, the same PR, with the body's middle removed and the pill flipped;
 * splitting them would have produced two files that drift apart at the bar.
 * So every body part below is optional and `status` drives only the pill.
 * The quiet variant is what you get by passing nothing but `summary`.
 *
 * ## What this must NOT depict
 *
 * An earlier version of this artifact drew an "Apply fix" BUTTON inside the
 * review. No such control exists. The product's fix mechanism is a comment
 * command and a suggestion that travels inside the review body, and rendering
 * a button was depicting a surface that is not there — the same defect class
 * as an invented breadcrumb. That is why there is no `actions` slot and no
 * `children`: the parts are enumerated so that a caller cannot quietly add a
 * control back. If the review ever grows a real affordance, it gets a named
 * prop and someone has to look at it.
 *
 * The second correction is subtler and lives in the prop names. The "How to
 * fix" heading and its paragraph are conditional in the real formatter — a
 * regression finding with no one-click edit renders one sentence, a missing
 * finding renders another — so `fixLabel` and `fix` are separate, optional,
 * and empty by default. This component knows the SHAPE of that section and
 * nothing about which sentence belongs in it. Hardcoding either one would
 * pin the marketing page to whichever branch of the formatter was read on the
 * day it was written, which is exactly how the stale version happened.
 *
 * ## Surfaces
 *
 * Fixed dark throughout: `terminal-chrome.github.*` for the ground, the rules
 * and the ink, `terminal.muted` for the quiet text. This depicts GitHub in
 * dark mode, and a GitHub that turns cream on a light page is not GitHub. The
 * one themed token is `brand.peach` on the avatar, which is the prototype's
 * own choice and is flagged in this port's notes rather than changed here.
 *
 * ## Spacing
 *
 * Every padding and margin is the literal px of the `--spacing-N` token
 * artifacts.css uses, for the reason `artifact-shell.tsx` documents at length:
 * `--spacing: 0.2rem` makes Tailwind's `p-4` 12.8px while `--spacing-4` is
 * 16px. Do not tidy these into scale steps.
 *
 * All content is props. Nothing here knows which repository, which event or
 * which finding.
 */
/** `fail` is "changes requested"; `pass` is the clean run. */
export type PrReviewStatus = 'fail' | 'pass';
/**
 * The severity dot beside an issue.
 *
 * Bound to the same three semantic tokens as `Finding`'s `good | warn | danger`
 * and `StatPill`'s `ok | warn | bad`, for the same reason: a marketing page and
 * a product that disagree about what "serious" looks like teach the reader the
 * wrong colour. The vocabulary differs because the domain does — an issue has
 * no "ok" state, and "low" is still an issue.
 */
export type PrIssueSeverity = 'high' | 'medium' | 'low';
export interface PrReviewIssue {
    /** Defaults to `medium`, which is the dot the prototype draws. */
    severity?: PrIssueSeverity;
    /**
     * The line. Wrap identifiers in `<code>` — event names and file paths are
     * styled monospace and allowed to break anywhere, which is what keeps a
     * 60-character path inside a 390px frame.
     */
    text: React.ReactNode;
}
export interface PrReviewProps {
    /** Selects the pill's colour. The words are `statusLabel`. */
    status: PrReviewStatus;
    /** Window-bar title — repository and PR number. */
    repo?: React.ReactNode;
    /** The pill's text, e.g. the review state GitHub reports. */
    statusLabel?: React.ReactNode;
    /** One or two characters for the round avatar. */
    avatar?: React.ReactNode;
    /** The reviewer's handle. */
    author?: React.ReactNode;
    /** The small outlined tag after the handle — an account type, not a status. */
    badge?: React.ReactNode;
    /** What the reviewer did, in GitHub's own past tense. */
    action?: React.ReactNode;
    /** The review's heading. Absent on the quiet variant. */
    title?: React.ReactNode;
    /** The one-line verdict under the heading. The whole body of a passing review. */
    summary?: React.ReactNode;
    /** Heading above `issues`. */
    issuesLabel?: React.ReactNode;
    issues?: PrReviewIssue[];
    /** Heading above `fix`. See the note about the formatter's two branches. */
    fixLabel?: React.ReactNode;
    fix?: React.ReactNode;
    /** The touched path, in the editor teal. */
    file?: React.ReactNode;
    /** The count that trails the path — how many inline comments landed there. */
    fileNote?: React.ReactNode;
    className?: string;
}
export declare function PrReview({ status, repo, statusLabel, avatar, author, badge, action, title, summary, issuesLabel, issues, fixLabel, fix, file, fileNote, className, }: PrReviewProps): import("react").JSX.Element;
//# sourceMappingURL=pr-review.d.ts.map