import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function CheckList({ onLight = false, dense = false, className, children }) {
    return (_jsx("ul", { className: cn('m-0 w-full list-none p-0', dense ? 'mb-7' : 'mb-8', 
        // The light case inherits from a `light` ancestor (PlanCard--featured,
        // ProductWindow tone=light), so the tokens resolve themselves. The flag
        // only switches which border token is correct.
        onLight ? '[--check-rule:var(--color-chrome-line-on-light)]' : '[--check-rule:var(--color-chrome-line-subtle)]', className), children: children }));
}
export function CheckItem({ dense = false, className, children }) {
    return (_jsxs("li", { className: cn('relative border-t text-text-muted-strong', dense ? 'py-[11px] pl-[25px] text-[13px]' : 'py-3 pl-[27px] text-[14px]', className), style: { borderTopColor: 'var(--check-rule)' }, children: [_jsx("span", { "aria-hidden": true, className: "absolute left-px top-3 text-brand-peach", children: "\u2713" }), children] }));
}
