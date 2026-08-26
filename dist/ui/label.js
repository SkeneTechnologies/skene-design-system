import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils.js";
function Label({ className, ...props }) {
    return (_jsx("label", { "data-slot": "label", className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className), ...props }));
}
export { Label };
