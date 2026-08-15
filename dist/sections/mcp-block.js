import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { AppPanel, PanelCaption } from './artifact-shell.js';
/**
 * One panel of the MCP screen: a two-part header rule, then whatever the panel
 * holds.
 *
 * ### The sibling gap
 *
 * The prototype's rule is `.mcp + .mcp { margin-top: 12px }` — the gap belongs to
 * the second panel, not to a wrapper, because the window body may hold one panel
 * or two and neither shape should need a different parent. So it is carried on the
 * block: `[&:not(:first-child)]:mt-[12px]`, which leaves a lone block with no
 * stray margin.
 *
 * One knowing deviation. `.mcp + .mcp` requires the PRECEDING sibling to be a
 * block; `:not(:first-child)` only requires that something precedes it. Reproducing
 * the original exactly would mean inventing a marker class or attribute to select
 * on, and `AppPanel` forwards neither. The difference is 12px above a block that
 * follows something else inside the window body, which is the gap you would want
 * there anyway. A caller stacking these with flex `gap` instead should pass the
 * same variant at zero (`[&:not(:first-child)]:mt-0`) — a bare `mt-0` will not win,
 * the variant carries more specificity and `cn` only merges classes whose variants
 * match.
 *
 * ### The header wraps, and the prototype's does not
 *
 * `.mcp__h` is a plain `space-between` row on the strength of knowing both its
 * strings. Here they are props, so `flex-wrap` is added: when the pair cannot
 * share a line the meta drops below the title instead of squeezing it to one word
 * per line. Same deviation, same reason, as the `AppWindow` bar. The title is
 * wrapped in a `<span>` rather than left as a bare text node so it can take
 * `min-w-0` — an anonymous flex item cannot.
 */
export function McpBlock({ title, meta, children, className }) {
    return (_jsxs(AppPanel, { className: cn('[&:not(:first-child)]:mt-[12px]', className), children: [title || meta ? (_jsxs(PanelCaption, { children: [_jsx("span", { className: "min-w-0", children: title }), meta ? (_jsx("span", { className: "min-w-0 text-[11px] text-muted-foreground", children: meta })) : null] })) : null, children] }));
}
/**
 * The config sample: a `<pre>` that scrolls sideways inside its own panel.
 *
 * `whitespace-pre` and `overflow-x-auto` are a pair and both are load-bearing at
 * 390px. The snippet is a nested JSON object whose deepest line is well past a
 * phone's width; wrapping it would break the shape a reader is meant to copy, so
 * it scrolls, and it scrolls HERE rather than in the body. `AppPanel` also clips
 * and scrolls, which makes two nested scroll containers — harmless, the inner one
 * wins, and the outer is what catches anything else the panel holds.
 *
 * Deliberately a bare `<pre>` and not `<pre><code>`: the UA sheet gives `code` its
 * own `font-family: monospace`, which would override the inherited Geist Mono and
 * silently swap the typeface for the browser default.
 *
 * No copy button. This is a drawing of a screen, not a widget, and the one on the
 * real screen belongs to the real screen.
 */
export function McpCode({ children, className }) {
    return (_jsx("pre", { className: cn('m-0 overflow-x-auto whitespace-pre p-[12px] font-mono text-[12px] leading-normal text-foreground', className), children: children }));
}
/**
 * One row of the tool catalogue: a name, a sentence, a rule under it.
 *
 * The name is `font-normal` on purpose despite being a `<b>`. A monospace
 * identifier set bold reads as emphasis on the identifier, when the emphasis
 * belongs to the row as a whole — the prototype says `font-weight: regular` here
 * and it is the same judgement `TagChip` makes about not uppercasing a table name.
 *
 * `wrap-anywhere` on the name: `skene_journey_analyse` has no space to break at,
 * and at 390px inside a padded panel an unbroken identifier is exactly what pushes
 * the page's horizontal scrollbar.
 *
 * The last row drops its rule via `last:border-b-0`, so the panel's own bottom
 * edge is the only line there. Rows are `<div>`s rather than a `<ul>`, matching the
 * surface being depicted; if this ever grows past a handful of tools, a list with
 * a real accessible name is the better shape and is a change to make deliberately.
 */
export function McpTool({ name, description, className }) {
    return (_jsxs("div", { className: cn('border-b border-border p-[12px] last:border-b-0', className), children: [_jsx("b", { className: "block font-mono text-[13px] font-normal text-foreground wrap-anywhere", children: name }), description ? (_jsx("span", { className: "mt-[2px] block text-[12px] text-muted-foreground", children: description })) : null] }));
}
