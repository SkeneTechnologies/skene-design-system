"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../lib/utils.js";
function Switch({ className, ...props }) {
    return (_jsx(SwitchPrimitives.Root, { "data-slot": "switch", className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-peach data-[state=unchecked]:bg-input", className), ...props, children: _jsx(SwitchPrimitives.Thumb, { "data-slot": "switch-thumb", className: cn("pointer-events-none block h-4 w-4 rounded-full bg-switch-thumb shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") }) }));
}
export { Switch };
