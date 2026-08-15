"use client";

import { toast, Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const _originalError = toast.error.bind(toast);
toast.error = ((
  message: Parameters<typeof _originalError>[0],
  data?: Parameters<typeof _originalError>[1],
) =>
  _originalError(message, {
    closeButton: true,
    ...data,
    duration: Infinity,
  })) as typeof toast.error;

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={toastOptions}
      {...props}
    />
  );
};

export { Toaster };
