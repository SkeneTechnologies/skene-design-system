import { STATUS_TOKEN } from '../lib/status.js'
import { cn } from '../lib/utils.js'
import { ArtPanel, ArtTitle, StatPill } from './artifact-shell.js'
import { TrafficLights } from './traffic-lights.js'

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
export type PrReviewStatus = 'fail' | 'pass'

/**
 * The severity dot beside an issue.
 *
 * Bound to the same three semantic tokens as `Finding`'s `good | warn | danger`
 * and `StatPill`'s `ok | warn | bad`, for the same reason: a marketing page and
 * a product that disagree about what "serious" looks like teach the reader the
 * wrong colour. The vocabulary differs because the domain does — an issue has
 * no "ok" state, and "low" is still an issue.
 */
export type PrIssueSeverity = 'high' | 'medium' | 'low'

const SEVERITY_TOKEN: Record<PrIssueSeverity, string> = {
  // Severity is GitHub's vocabulary, not the package's, so the names differ —
  // but the three colours are the same measured-state triple, taken from the
  // one map rather than restated as a fourth copy of the custom properties.
  high: STATUS_TOKEN.danger,
  medium: STATUS_TOKEN.warn,
  low: STATUS_TOKEN.good,
}

/** The two `.pr__sub` headings and the two `.pr__msg` paragraphs, kept once. */
const SUB = 'mb-[8px] font-sans text-[12px] font-medium'
const MSG = 'mb-[16px] font-sans text-[14px] leading-normal'

export interface PrReviewIssue {
  /** Defaults to `medium`, which is the dot the prototype draws. */
  severity?: PrIssueSeverity
  /**
   * The line. Wrap identifiers in `<code>` — event names and file paths are
   * styled monospace and allowed to break anywhere, which is what keeps a
   * 60-character path inside a 390px frame.
   */
  text: React.ReactNode
}

export interface PrReviewProps {
  /** Selects the pill's colour. The words are `statusLabel`. */
  status: PrReviewStatus
  /** Window-bar title — repository and PR number. */
  repo?: React.ReactNode
  /** The pill's text, e.g. the review state GitHub reports. */
  statusLabel?: React.ReactNode
  /** One or two characters for the round avatar. */
  avatar?: React.ReactNode
  /** The reviewer's handle. */
  author?: React.ReactNode
  /** The small outlined tag after the handle — an account type, not a status. */
  badge?: React.ReactNode
  /** What the reviewer did, in GitHub's own past tense. */
  action?: React.ReactNode
  /** The review's heading. Absent on the quiet variant. */
  title?: React.ReactNode
  /** The one-line verdict under the heading. The whole body of a passing review. */
  summary?: React.ReactNode
  /** Heading above `issues`. */
  issuesLabel?: React.ReactNode
  issues?: PrReviewIssue[]
  /** Heading above `fix`. See the note about the formatter's two branches. */
  fixLabel?: React.ReactNode
  fix?: React.ReactNode
  /** The touched path, in the editor teal. */
  file?: React.ReactNode
  /** The count that trails the path — how many inline comments landed there. */
  fileNote?: React.ReactNode
  className?: string
}

export function PrReview({
  status,
  repo,
  statusLabel,
  avatar,
  author,
  badge,
  action,
  title,
  summary,
  issuesLabel,
  issues,
  fixLabel,
  fix,
  file,
  fileNote,
  className,
}: PrReviewProps) {
  const who = avatar || author || badge || action
  return (
    <ArtPanel
      className={cn('bg-terminal-chrome-github-dark-bg font-mono text-[13px]', className)}
    >
      {/*
        Not `ArtPanel`'s own `bar` slot. That one is the editor/terminal strip —
        `terminal.bar` on `terminal.border`, 32px tall, 8px gap. GitHub's header
        is its own surface and a step roomier, and the prototype makes the same
        split: `.pr` takes `.art`'s frame but declares `.pr__bar` rather than
        reusing `.art__bar`.

        It wraps. The bar is unwrappable in the prototype and survives 390px only
        because `.art` clips it, which silently eats the pill — the one element
        in the bar that carries state. Wrapping keeps the page free of horizontal
        scroll the same way and keeps the pill on the page.
      */}
      <div className="flex flex-wrap items-center gap-[12px] border-b border-terminal-chrome-github-border bg-terminal-chrome-github-dark-surface px-[16px] py-[12px] text-terminal-chrome-github-text">
        {/* Window furniture, not status. Grouped so the three never split across
            a wrapped line, and hidden because they say nothing — both of which
            `TrafficLights` now owns. `gap-[12px]` is the override the component
            documents: GitHub's header is a step roomier than the terminal bar
            this shares its dots with, and 12px is what shipped here. */}
        <TrafficLights className="gap-[12px]" />
        {repo ? (
          <ArtTitle className="min-w-0 flex-1 [overflow-wrap:anywhere]">{repo}</ArtTitle>
        ) : null}
        {statusLabel ? (
          // `.pr__state` IS `StatPill`, to the percentage: fail is the `bad`
          // recipe at 40/10, pass is `ok` at 35/12. The only difference is the
          // typeface — the pill inherits the artifact's mono here, where the
          // shared component assumes the product's sans.
          <StatPill status={status === 'pass' ? 'ok' : 'bad'} className="ml-auto font-mono">
            {statusLabel}
          </StatPill>
        ) : null}
      </div>

      {/*
        `[&>*:last-child]:mb-0` replaces the prototype's inline
        `style="margin-bottom:0"` on the passing review's one paragraph. Same
        result there, and it also removes the 12px the failing review leaves
        under its file line — 36px of bottom padding against 24px everywhere
        else, which was an artefact of the last block owning a margin rather
        than a decision.
      */}
      <div className="min-w-0 p-[24px] text-terminal-chrome-github-text [&>*:last-child]:mb-0">
        {who ? (
          <div className="mb-[16px] flex flex-wrap items-center gap-[12px]">
            {avatar ? (
              <span className="grid size-[24px] shrink-0 place-items-center rounded-full bg-brand-peach text-[11px] font-bold text-brand-peach-text">
                {avatar}
              </span>
            ) : null}
            {author ? <span>{author}</span> : null}
            {badge ? (
              <span className="rounded-full border border-terminal-chrome-github-border px-[8px] py-[4px] font-sans text-[11px] leading-none text-terminal-muted">
                {badge}
              </span>
            ) : null}
            {action ? <span className="text-[12px] text-terminal-muted">{action}</span> : null}
          </div>
        ) : null}

        {title ? <div className="mb-[12px] font-sans text-[18px] font-medium">{title}</div> : null}
        {summary ? <div className={MSG}>{summary}</div> : null}

        {issuesLabel ? <div className={SUB}>{issuesLabel}</div> : null}
        {issues?.map((issue, i) => (
          <div
            key={i}
            className="mb-[16px] flex items-start gap-[8px] font-sans text-[14px] [&_code]:font-mono [&_code]:[overflow-wrap:anywhere]"
          >
            {/* Decorative: the severity is also a word in the line beside it,
                so announcing the dot would say "medium" twice. */}
            <span
              aria-hidden
              className="mt-[6px] size-[8px] shrink-0 rounded-full"
              style={{ background: SEVERITY_TOKEN[issue.severity ?? 'medium'] }}
            />
            <span className="min-w-0">{issue.text}</span>
          </div>
        ))}

        {fixLabel ? <div className={SUB}>{fixLabel}</div> : null}
        {fix ? <div className={MSG}>{fix}</div> : null}

        {file ? (
          <div className="mb-[12px] text-[12px] text-terminal-chrome-vscode-teal [overflow-wrap:anywhere]">
            {file}
            {fileNote ? (
              <span className="ml-[12px] font-sans text-terminal-muted">{fileNote}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </ArtPanel>
  )
}
