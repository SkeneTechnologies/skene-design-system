"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils.js";
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
function DialogOverlay({ className, ...props }) {
    return (_jsx(DialogPrimitive.Overlay, { "data-slot": "dialog-overlay", className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props }));
}
function DialogContent({ className, children, ...props }) {
    return (_jsxs(DialogPortal, { children: [_jsx(DialogOverlay, {}), _jsxs(DialogPrimitive.Content, { "data-slot": "dialog-content", className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className), ...props, children: [children, _jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Close" })] })] })] }));
}
function DialogHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "dialog-header", className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props }));
}
function DialogFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "dialog-footer", className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props }));
}
function DialogTitle({ className, ...props }) {
    return (_jsx(DialogPrimitive.Title, { "data-slot": "dialog-title", className: cn("text-lg font-semibold leading-none tracking-tight", className), ...props }));
}
function DialogDescription({ className, ...props }) {
    return (_jsx(DialogPrimitive.Description, { "data-slot": "dialog-description", className: cn("text-sm text-muted-foreground", className), ...props }));
}
export { Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, };
