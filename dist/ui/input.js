import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
function Input({ className, type, ...props }) {
    return (_jsx("input", { type: type, "data-slot": "input", className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-brand-peach selection:text-brand-peach-text border-input h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 aria-invalid:border-destructive", className), ...props }));
}
export { Input };
