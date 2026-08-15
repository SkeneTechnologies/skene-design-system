import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function TrafficLights({ className }) {
    return (_jsxs("span", { "aria-hidden": true, className: cn('flex shrink-0 items-center gap-[8px]', className), children: [_jsx("span", { className: "size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-red" }), _jsx("span", { className: "size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-yellow" }), _jsx("span", { className: "size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-green" })] }));
}
