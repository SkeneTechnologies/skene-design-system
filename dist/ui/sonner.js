"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { toast, Toaster as Sonner } from "sonner";
const _originalError = toast.error.bind(toast);
toast.error = ((message, data) => _originalError(message, {
    closeButton: true,
    ...data,
    duration: Infinity,
}));
const Toaster = ({ toastOptions, ...props }) => {
    return (_jsx(Sonner, { theme: "light", className: "toaster group", toastOptions: toastOptions, ...props }));
};
export { Toaster };
