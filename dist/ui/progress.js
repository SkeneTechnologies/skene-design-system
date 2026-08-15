"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../lib/utils.js";
function Progress({ className, value, ...props }) {
    return (_jsx(ProgressPrimitive.Root, { "data-slot": "progress", className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className), ...props, children: _jsx(ProgressPrimitive.Indicator, { "data-slot": "progress-indicator", className: "h-full w-full flex-1 bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to transition-all", style: { transform: `translateX(-${100 - (value || 0)}%)` } }) }));
}
export { Progress };
