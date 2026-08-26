'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * Monthly / yearly switch.
 *
 * Both labels are clickable, not just the track. A 40px switch is a small target
 * and the words next to it are the obvious thing to press.
 */
export function BillingToggle({ yearly, onChange, monthlyLabel = 'Billed monthly', yearlyLabel = 'Billed yearly', className, }) {
    return (_jsxs("div", { className: cn('flex items-center gap-3 text-[13px]', className), children: [_jsx("button", { type: "button", onClick: () => onChange(false), className: cn('transition-colors', yearly ? 'text-chrome-text-muted-warm' : 'text-chrome-text-primary'), children: monthlyLabel }), _jsx("button", { type: "button", role: "switch", "aria-checked": yearly, "aria-label": "Bill yearly", onClick: () => onChange(!yearly), className: "relative h-6 w-11 shrink-0 rounded-full border border-chrome-line-strong bg-chrome-surface-2 transition-colors", children: _jsx("span", { className: cn('absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-brand-light transition-[left]', yearly ? 'left-[26px]' : 'left-1') }) }), _jsx("button", { type: "button", onClick: () => onChange(true), className: cn('transition-colors', yearly ? 'text-chrome-text-primary' : 'text-chrome-text-muted-warm'), children: yearlyLabel })] }));
}
