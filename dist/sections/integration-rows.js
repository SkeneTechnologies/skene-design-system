import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { artifactHeader, AppPanel, AppWindow, StatPill } from './artifact-shell.js';
export function IntegrationRows({ rows, title, source, separator = '/', summary, summaryStatus = 'ok', actions, className, }) {
    // Both computed as undefined-when-empty rather than as empty elements:
    // `AppWindow` drops the whole bar when neither is present, and an empty flex
    // row above the panel reads as a rendering fault.
    // Both halves undefined-when-empty rather than empty elements: AppWindow
    // drops the whole bar when neither is present, and an empty flex row above
    // the panel reads as a rendering fault. See artifact-shell.
    const { crumb, bar } = artifactHeader({
        title,
        source,
        separator,
        summary,
        summaryStatus,
        actions,
    });
    return (_jsx(AppWindow, { crumb: crumb, actions: bar, className: className, children: _jsx(AppPanel, { children: _jsx("ul", { className: "m-0 list-none p-0", children: rows.map((row, i) => {
                    const right = row.status || row.aside ? (
                    // The 8px is `.app__actions`, not a number picked here: a pill
                    // and the control beside it are one cluster wherever they
                    // appear in this product.
                    _jsxs("div", { className: "flex shrink-0 items-center gap-[8px]", children: [row.status ? _jsx(StatPill, { status: row.status, children: row.statusLabel }) : null, row.aside] })) : null;
                    return (_jsxs("li", { className: cn(
                        // `minmax(0, 1fr)` and not `1fr`: the default `min-width:
                        // auto` on a grid item is its content's intrinsic width, so a
                        // long note would push the row wider than the panel instead
                        // of wrapping, and the page body — not the artifact — is what
                        // ends up scrolling.
                        'grid items-center gap-[12px] border-b border-border p-[12px] last:border-b-0', right ? 'grid-cols-[minmax(0,1fr)_auto]' : 'grid-cols-[minmax(0,1fr)]', row.className), children: [_jsxs("div", { className: "min-w-0 text-[13px] text-foreground wrap-anywhere", children: [row.name, row.note ? (
                                    // 2px, which is smaller than any spacing token and is meant
                                    // to be: the note is the same object as the name, one line
                                    // down, not the next thing in a stack.
                                    _jsx("small", { className: "mt-[2px] block text-[12px] text-muted-foreground", children: row.note })) : null] }), right] }, row.id ?? i));
                }) }) }) }));
}
