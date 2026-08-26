import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The two small labels that recur beside headings: a fact, and a promise.
 *
 * They look nearly identical at a glance, and that is exactly why they are two
 * components rather than one with a `variant` prop. `StatChip` asserts something
 * that is true right now ("121 stars"); `MetaChip` marks something that is not
 * shipped yet ("Turnkey dollar-revenue view — ROADMAP"). A single component with
 * a flag makes the default the live reading, so a forgotten prop silently turns
 * a roadmap item into a claim about the product. Two names cannot be defaulted
 * into each other.
 *
 * Type uses the theme-aware `text.*` role. Both chips appear on the dark page
 * and on the cream `LightSectionCard`, and `chrome.text.*` is invariant by
 * definition — cream that cannot invert, i.e. invisible on cream.
 *
 * The border and fill are the harder half of the same problem: there is no
 * mode-aware line token. `chrome.line.subtle` is white at 12% (invisible on
 * cream) and `chrome.line.onLight` is black at 14% (invisible on the dark page),
 * so a chip that must survive both derives both edges from `currentColor` — which
 * already follows the `light` ancestor via the text role. One rule, both grounds,
 * no `onLight` prop for a caller to get wrong.
 *
 * The icon slot is a `ReactNode` rather than a name, because the live instances
 * are literal emoji in the copy (★, 🕐). It is `aria-hidden`: the value beside it
 * already says what it is, and "black star 121 stars" is noise.
 */
/**
 * The shared box. Private: `StatChip` and `MetaChip` stay two exports for the
 * reason the file header gives — a flag would let a roadmap marker default into
 * a live claim — but they were also two copies of one geometry, differing in a
 * gap, an ink role and two mix percentages. Those three are parameters now, so
 * `docs/sections.md` §2 point 3, which asks whether these should adopt the
 * window chips' rectangle, becomes a one-line change instead of two.
 */
function Pill({ gap, ink, border, fill, icon, className, children, }) {
    return (_jsxs("span", { className: cn('inline-flex items-center rounded-full border px-3 py-1 text-[12px] leading-none', gap, ink, className), style: {
            // Both edges derive from currentColor, which already follows a `light`
            // ancestor — the trick that lets these survive both grounds with no
            // `onLight` prop. See the file header.
            borderColor: `color-mix(in oklab, currentColor ${border}%, transparent)`,
            background: `color-mix(in oklab, currentColor ${fill}%, transparent)`,
        }, children: [icon ? (_jsx("span", { "aria-hidden": true, className: "shrink-0", children: icon })) : null, children] }));
}
export function StatChip({ icon, className, children }) {
    return (_jsx(Pill, { gap: "gap-1.5", ink: "text-text-muted-strong", border: 26, fill: 7, icon: icon, className: className, children: children }));
}
export function MetaChip({ icon, children, status, className }) {
    return (_jsxs(Pill, { gap: "gap-2.5", ink: "text-text-muted", border: 22, fill: 6, icon: icon, className: className, children: [_jsx("span", { children: children }), _jsx("span", { "aria-hidden": true, className: "h-[13px] w-px shrink-0", style: { background: 'color-mix(in oklab, currentColor 30%, transparent)' } }), _jsx("span", { className: "shrink-0 font-mono uppercase tracking-[0.07em] text-brand-peach", children: status })] }));
}
