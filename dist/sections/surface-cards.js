import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { GlyphBadge } from './glyph-badge.js';
export function SurfaceCards({ surfaces, featured = 0, texture, className }) {
    return (_jsxs("div", { className: cn('relative overflow-hidden rounded-xl bg-surface-deep-2 p-[24px]', className), children: [texture ? (_jsx("img", { src: texture, alt: "", "aria-hidden": true, className: "pointer-events-none absolute inset-0 h-full w-full object-cover" })) : null, _jsx("div", { className: "relative", children: _jsx("div", { className: "grid grid-cols-1 gap-[12px] sm:grid-cols-2", children: surfaces.map((s, i) => (_jsxs("article", { className: i === featured
                            ? 'light rounded-lg border border-chrome-line-on-light bg-brand-light p-[16px]'
                            : 'dark rounded-lg border border-chrome-surface-border bg-chrome-surface-1 p-[16px]', children: [s.icon ? (_jsx(GlyphBadge, { tone: i === featured ? 'tint' : 'muted', size: 32, className: "mb-[12px]", glyphSize: "var(--font-size-body)", children: s.icon })) : null, _jsx("h3", { className: "font-semibold text-text-primary", style: { fontSize: 'var(--font-size-ui)' }, children: s.title }), s.context ? (_jsx("p", { className: "mt-[4px] text-text-muted", style: { fontSize: 'var(--font-size-body-sm)' }, children: s.context })) : null, s.detail ? (_jsx("p", { className: "mt-[10px] text-text-muted", style: { fontSize: 'var(--font-size-body)' }, children: s.detail })) : null, s.code ? (_jsx("code", { className: "mt-[10px] inline-block max-w-full rounded-md border px-[8px] py-[2px] font-mono text-text-primary [overflow-wrap:anywhere]", style: {
                                    fontSize: 'var(--font-size-body-sm)',
                                    // Mixed from the card's own ink rather than named, because
                                    // this hairline has to hold on both grounds — cream on the
                                    // featured card, near-black on the other three — and no
                                    // single line token is correct for both.
                                    borderColor: 'color-mix(in oklab, currentColor 22%, transparent)',
                                }, children: s.code })) : null] }, s.id))) }) })] }));
}
