"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva } from "class-variance-authority";
import { Input } from "./input.js";
import { Switch } from "./switch.js";
import { cn } from "../lib/utils.js";
const settingsFieldVariants = cva("rounded-sm border text-sm text-foreground shadow-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none", {
    variants: {
        tone: {
            default: "border-border bg-card focus-visible:border-brand-peach focus-visible:ring-brand-peach/40",
            muted: "border-border bg-muted text-muted-foreground cursor-not-allowed focus-visible:ring-0",
        },
        validation: {
            none: "",
            warning: "border-semantic-warning-amber focus-visible:ring-semantic-warning-amber/40",
            error: "border-semantic-error-red focus-visible:ring-semantic-error-red/40",
            success: "border-semantic-matcha focus-visible:ring-semantic-matcha/40",
            destructive: "focus-visible:ring-semantic-error-red/40",
        },
        mono: {
            true: "font-mono",
            false: "",
        },
    },
    defaultVariants: {
        tone: "default",
        validation: "none",
        mono: false,
    },
});
const settingsSelectVariants = cva("w-full appearance-none cursor-pointer rounded-sm border border-border bg-card text-foreground shadow-none transition-colors outline-none focus-visible:border-brand-peach focus-visible:ring-2 focus-visible:ring-brand-peach/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed", {
    variants: {
        size: {
            default: "h-9 pl-3 pr-9 text-sm",
            sm: "py-1.5 pl-2 pr-8 text-xs",
        },
        tone: {
            default: "",
            muted: "border-border bg-muted text-muted-foreground cursor-not-allowed focus-visible:ring-0",
        },
    },
    defaultVariants: {
        size: "default",
        tone: "default",
    },
});
function SettingsInput({ className, disabled, tone, validation = "none", mono = false, ...props }) {
    const resolvedTone = tone ?? (disabled ? "muted" : "default");
    return (_jsx(Input, { disabled: disabled, className: cn("h-auto py-2 shadow-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:opacity-100", settingsFieldVariants({ tone: resolvedTone, validation, mono }), className), ...props }));
}
function SettingsSelect({ className, size = "default", disabled, children, ...props }) {
    const tone = disabled ? "muted" : "default";
    return (_jsxs("div", { className: "relative w-full", children: [_jsx("select", { disabled: disabled, className: cn(settingsSelectVariants({ size, tone }), className), ...props, children: children }), _jsx(ChevronDown, { "aria-hidden": true, className: cn("pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground opacity-50", size === "sm" ? "right-2" : "right-3") })] }));
}
function SettingsSwitch({ className, label, labelPosition = "left", labelClassName, description, id, disabled, ...props }) {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;
    const switchControl = (_jsx(Switch, { id: switchId, disabled: disabled, className: cn("shrink-0", className), ...props }));
    if (!label && !description) {
        return switchControl;
    }
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: cn("flex items-center gap-2", labelPosition === "right" && "flex-row-reverse justify-end"), children: [label ? (_jsx("label", { htmlFor: switchId, className: cn("text-sm font-medium text-foreground", labelClassName, disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"), children: label })) : null, switchControl] }), description ? (_jsx("p", { className: "text-xs text-muted-foreground", children: description })) : null] }));
}
export { SettingsInput, SettingsSelect, SettingsSwitch, settingsFieldVariants, settingsSelectVariants, };
