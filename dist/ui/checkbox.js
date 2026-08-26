"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../lib/utils.js";
function Checkbox({ className, ...props }) {
    return (_jsx(CheckboxPrimitive.Root, { "data-slot": "checkbox", className: cn("peer h-4 w-4 shrink-0 rounded-sm border border-border focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-peach data-[state=checked]:bg-brand-peach data-[state=checked]:text-brand-peach-text", className), ...props, children: _jsx(CheckboxPrimitive.Indicator, { "data-slot": "checkbox-indicator", className: cn("flex items-center justify-center text-current"), children: _jsx(Check, { className: "h-4 w-4" }) }) }));
}
export { Checkbox };
