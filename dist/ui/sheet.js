"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils.js";
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;
function SheetOverlay({ className, ...props }) {
    return (_jsx(DialogPrimitive.Overlay, { "data-slot": "sheet-overlay", className: cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props }));
}
function SheetContent({ className, children, side = "right", ...props }) {
    return (_jsxs(SheetPortal, { children: [_jsx(SheetOverlay, {}), _jsxs(DialogPrimitive.Content, { "data-slot": "sheet-content", className: cn("fixed z-50 flex flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out", side === "right"
                    ? "inset-y-0 right-0 w-[420px] border-l border-border data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                    : "inset-y-0 left-0 w-[420px] border-r border-border data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", className), ...props, children: [children, _jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Close" })] })] })] }));
}
function SheetHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "sheet-header", className: cn("flex items-center justify-between px-4 py-3 border-b border-border", className), ...props }));
}
function SheetTitle({ className, ...props }) {
    return (_jsx(DialogPrimitive.Title, { "data-slot": "sheet-title", className: cn("text-sm font-semibold text-foreground", className), ...props }));
}
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, };
