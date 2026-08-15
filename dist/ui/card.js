import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils.js";
const CARD_VARIANTS = {
    default: "bg-card text-card-foreground shadow",
    surface: "block border border-surface-border bg-surface-1 p-[24px] no-underline",
};
function Card({ className, variant = "default", asChild = false, ...props }) {
    const Comp = asChild ? Slot : "div";
    return (_jsx(Comp, { "data-slot": "card", className: cn("rounded-xl", CARD_VARIANTS[variant], className), ...props }));
}
function CardHeader({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-header", className: cn("flex flex-col space-y-1.5 p-6", className), ...props }));
}
function CardTitle({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-title", className: cn("font-semibold leading-none tracking-tight", className), ...props }));
}
function CardDescription({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-description", className: cn("text-sm text-muted-foreground", className), ...props }));
}
function CardContent({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-content", className: cn("p-6 pt-0", className), ...props }));
}
function CardFooter({ className, ...props }) {
    return (_jsx("div", { "data-slot": "card-footer", className: cn("flex items-center p-6 pt-0", className), ...props }));
}
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, };
