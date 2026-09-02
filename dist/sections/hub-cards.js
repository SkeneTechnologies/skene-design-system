import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils.js';
export function HubCards({ children, className }) {
    return (_jsx("div", { className: cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3', className), children: children }));
}
export function HubCard({ icon, title, description, children, cta, asChild = false, className, ...props }) {
    const Root = asChild ? Slot : 'a';
    return (_jsxs(Root, { className: cn('group flex flex-col gap-4 rounded-sm border border-chrome-line-subtle p-6 no-underline', '[background:rgba(20,20,20,0.6)]', 'transition-colors duration-300 ease-in-out', 'hover:border-brand-peach hover:[background:rgba(20,20,20,0.8)]', className), ...props, children: [_jsxs("div", { className: "flex items-start gap-4", children: [icon ? (_jsx("span", { "aria-hidden": true, className: "flex size-10 shrink-0 items-center justify-center rounded-sm text-brand-peach [background:rgba(212,165,116,0.15)]", children: icon })) : null, _jsxs("span", { className: "block", children: [_jsx("span", { className: "block text-[18px] font-medium text-chrome-text-primary", children: title }), description ? (_jsx("span", { className: "mt-1 block text-sm text-chrome-text-muted-strong", children: description })) : null] })] }), children ? _jsx("div", { className: "text-sm text-chrome-text-muted-strong", children: children }) : null, cta ? (_jsxs("span", { className: "mt-auto inline-flex items-center gap-1.5 text-sm text-brand-peach", children: [cta, _jsx("svg", { "aria-hidden": true, viewBox: "0 0 16 16", className: "size-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M3 8h10M9 4l4 4-4 4", strokeLinecap: "round", strokeLinejoin: "round" }) })] })) : null] }));
}
