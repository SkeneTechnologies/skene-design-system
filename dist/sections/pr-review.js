import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_TOKEN } from '../lib/status.js';
import { cn } from '../lib/utils.js';
import { ArtPanel, ArtTitle, StatPill } from './artifact-shell.js';
import { TrafficLights } from './traffic-lights.js';
const SEVERITY_TOKEN = {
    // Severity is GitHub's vocabulary, not the package's, so the names differ —
    // but the three colours are the same measured-state triple, taken from the
    // one map rather than restated as a fourth copy of the custom properties.
    high: STATUS_TOKEN.danger,
    medium: STATUS_TOKEN.warn,
    low: STATUS_TOKEN.good,
};
/** The two `.pr__sub` headings and the two `.pr__msg` paragraphs, kept once. */
const SUB = 'mb-[8px] font-sans text-[12px] font-medium';
const MSG = 'mb-[16px] font-sans text-[14px] leading-normal';
export function PrReview({ status, repo, statusLabel, avatar, author, badge, action, title, summary, issuesLabel, issues, fixLabel, fix, file, fileNote, className, }) {
    const who = avatar || author || badge || action;
    return (_jsxs(ArtPanel, { className: cn('bg-terminal-chrome-github-dark-bg font-mono text-[13px]', className), children: [_jsxs("div", { className: "flex flex-wrap items-center gap-[12px] border-b border-terminal-chrome-github-border bg-terminal-chrome-github-dark-surface px-[16px] py-[12px] text-terminal-chrome-github-text", children: [_jsx(TrafficLights, { className: "gap-[12px]" }), repo ? (_jsx(ArtTitle, { className: "min-w-0 flex-1 [overflow-wrap:anywhere]", children: repo })) : null, statusLabel ? (
                    // `.pr__state` IS `StatPill`, to the percentage: fail is the `bad`
                    // recipe at 40/10, pass is `ok` at 35/12. The only difference is the
                    // typeface — the pill inherits the artifact's mono here, where the
                    // shared component assumes the product's sans.
                    _jsx(StatPill, { status: status === 'pass' ? 'ok' : 'bad', className: "ml-auto font-mono", children: statusLabel })) : null] }), _jsxs("div", { className: "min-w-0 p-[24px] text-terminal-chrome-github-text [&>*:last-child]:mb-0", children: [who ? (_jsxs("div", { className: "mb-[16px] flex flex-wrap items-center gap-[12px]", children: [avatar ? (_jsx("span", { className: "grid size-[24px] shrink-0 place-items-center rounded-full bg-brand-peach text-[11px] font-bold text-brand-peach-text", children: avatar })) : null, author ? _jsx("span", { children: author }) : null, badge ? (_jsx("span", { className: "rounded-full border border-terminal-chrome-github-border px-[8px] py-[4px] font-sans text-[11px] leading-none text-terminal-muted", children: badge })) : null, action ? _jsx("span", { className: "text-[12px] text-terminal-muted", children: action }) : null] })) : null, title ? _jsx("div", { className: "mb-[12px] font-sans text-[18px] font-medium", children: title }) : null, summary ? _jsx("div", { className: MSG, children: summary }) : null, issuesLabel ? _jsx("div", { className: SUB, children: issuesLabel }) : null, issues?.map((issue, i) => (_jsxs("div", { className: "mb-[16px] flex items-start gap-[8px] font-sans text-[14px] [&_code]:font-mono [&_code]:[overflow-wrap:anywhere]", children: [_jsx("span", { "aria-hidden": true, className: "mt-[6px] size-[8px] shrink-0 rounded-full", style: { background: SEVERITY_TOKEN[issue.severity ?? 'medium'] } }), _jsx("span", { className: "min-w-0", children: issue.text })] }, i))), fixLabel ? _jsx("div", { className: SUB, children: fixLabel }) : null, fix ? _jsx("div", { className: MSG, children: fix }) : null, file ? (_jsxs("div", { className: "mb-[12px] text-[12px] text-terminal-chrome-vscode-teal [overflow-wrap:anywhere]", children: [file, fileNote ? (_jsx("span", { className: "ml-[12px] font-sans text-terminal-muted", children: fileNote })) : null] })) : null] })] }));
}
