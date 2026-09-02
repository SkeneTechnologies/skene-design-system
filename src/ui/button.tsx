import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-peach text-brand-peach-text hover:bg-primary-hover transition-all duration-300 ease-in-out",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/70 transition-colors duration-300 ease-in-out",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground transition-colors duration-300 ease-in-out",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/40 transition-colors duration-300 ease-in-out",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-brand-link underline-offset-4 hover:text-brand-link/80 hover:underline transition-colors duration-300 ease-in-out",
        // A translucent control that sits ON artwork rather than on a surface,
        // and reads through it. Ported from skene-marketing-website's
        // styled-components Button, which is the only place the estate had
        // this and which is being retired: its CTA pairs a solid primary with
        // one of these over a full-bleed texture.
        //
        // The blur reads `--blur-glass` through an arbitrary value rather than
        // a named `backdrop-blur-glass` utility. The generated `@theme inline`
        // block registers COLOURS only, so a blur token in `:root` produces no
        // utility on its own, and hand-registering one in `styles/index.css`
        // would give the value two homes that can disagree.
        //
        // The alpha values are transcribed from the retired implementation,
        // not chosen.
        //
        // `supports-[not_(backdrop-filter:blur(0))]` raises the background to
        // an opaque-enough value where backdrop-filter is unavailable. Without
        // it the control is a 0.08 alpha wash over artwork, which is where the
        // label stops being readable rather than merely losing its frosting.
        glass:
          "border border-chrome-surface-border bg-white/8 text-chrome-text-muted-strong backdrop-blur-[var(--blur-glass)] hover:bg-white/12 hover:text-chrome-text-primary transition-colors duration-300 ease-in-out supports-[not_(backdrop-filter:blur(0))]:bg-white/20",
        "glass-dark":
          "border border-chrome-surface-border bg-black/50 text-chrome-text-primary backdrop-blur-[var(--blur-glass)] hover:bg-black/65 transition-colors duration-300 ease-in-out supports-[not_(backdrop-filter:blur(0))]:bg-black/80",
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
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
