import { jsx as _jsx } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.js";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-brand-peach text-brand-peach-text hover:bg-primary-hover transition-all duration-300 ease-in-out",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/70 transition-colors duration-300 ease-in-out",
            outline: "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground transition-colors duration-300 ease-in-out",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/40 transition-colors duration-300 ease-in-out",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-brand-link underline-offset-4 hover:text-brand-link/80 hover:underline transition-colors duration-300 ease-in-out",
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 px-3 text-xs",
            lg: "h-10 px-8",
            icon: "h-9 w-9",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (_jsx(Comp, { "data-slot": "button", className: cn(buttonVariants({ variant, size, className })), ...props }));
}
export { Button, buttonVariants };
