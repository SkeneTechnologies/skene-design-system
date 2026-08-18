'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Children, isValidElement, useId, useMemo, useState } from 'react';
import { cn } from '../lib/utils.js';
import { PILL_NAV_FROSTED_STYLE, PILL_NAV_POSITION } from './pill-nav-frosted.js';
import { PillNavMobileMenuLayers, PillNavMobileMenuToggle, } from './pill-nav-mobile-menu.js';
function collectMobileLinks(children) {
    const links = [];
    Children.forEach(children, (child) => {
        if (!isValidElement(child)) {
            return;
        }
        const isPillNavLink = child.type === PillNavLink ||
            (typeof child.type === 'function' && child.type.name === 'PillNavLink');
        if (!isPillNavLink)
            return;
        links.push({
            href: child.props.href,
            label: child.props.children,
            active: child.props.active,
        });
    });
    return links;
}
/**
 * Floating pill navigation with a marketing-site mobile drawer below `md`.
 */
export function PillNav({ brand, actions, className, position = 'absolute', children, }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileLinks = useMemo(() => collectMobileLinks(children), [children]);
    const panelId = useId();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: cn(PILL_NAV_POSITION[position], 'pointer-events-none flex items-center justify-between gap-4 p-4 md:px-6', className), children: [_jsxs("nav", { className: cn('pointer-events-auto hidden shrink-0 flex-nowrap items-center gap-1 rounded-[4px] py-2 pl-4 pr-2 md:flex'), style: PILL_NAV_FROSTED_STYLE, children: [brand ? _jsx("span", { className: "mr-2 flex shrink-0 items-center", children: brand }) : null, _jsx("span", { className: "flex flex-nowrap items-center gap-0.5", children: children })] }), brand ? (_jsx("div", { className: "pointer-events-auto relative z-[1050] flex shrink-0 items-center md:hidden", children: brand })) : null, _jsx(PillNavMobileMenuToggle, { isOpen: mobileMenuOpen, onOpenChange: setMobileMenuOpen, panelId: panelId }), actions ? (_jsx("div", { className: "pointer-events-auto hidden shrink-0 items-center gap-1 md:flex", children: actions })) : null] }), _jsx(PillNavMobileMenuLayers, { links: mobileLinks, actions: actions, isOpen: mobileMenuOpen, onOpenChange: setMobileMenuOpen, panelId: panelId })] }));
}
export function PillNavLink({ href, children, className, active = false, }) {
    return (_jsx("a", { href: href, "data-pill-nav-link": "", className: cn('rounded-[4px] px-4 py-1.5 text-sm tracking-[-0.01em] whitespace-nowrap shrink-0 transition-colors duration-150', active ? 'text-brand-peach' : 'text-white/90', 'hover:bg-white/[0.06] hover:text-chrome-text-primary', className), children: children }));
}
