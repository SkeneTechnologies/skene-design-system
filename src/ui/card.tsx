import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/utils.js";

/**
 * The card: shadcn's product container, and the flat marketing variant of the
 * same object.
 *
 * `default` is the shipped shadcn recipe untouched — `bg-card`,
 * `text-card-foreground`, a shadow — with `CardHeader`/`CardContent`/
 * `CardFooter` bringing their own padding. Nothing about it moved.
 *
 * `surface` is a variant rather than a second component because it is not a
 * second object. `rounded-xl border border-surface-border bg-surface-1
 * p-[24px]` appears INLINE eight times across skene-site's routes, character
 * for character, with six more near-copies adding only `no-underline` /
 * `block` / `flex flex-col` — and those six are the same card rendered as an
 * `<a>`. Fourteen call sites of one recipe is what a variant is for; a
 * `SurfaceCard` sitting beside `Card` would be the fifteenth file with its own
 * opinion about what a panel is.
 *
 * ## NOT `AppPanel`
 *
 * `AppPanel` is this shape in the artifact register: the panel drawn INSIDE an
 * `AppWindow`, at `rounded-lg` on the product's border, scrolling sideways
 * because a `DataTable` lives in it. If you are drawing a picture of Skene
 * Cloud rather than building a page, that is the one.
 *
 * ## The trap is padding
 *
 * `surface` bakes in 24px and `default` deliberately does not, because
 * `default` expects the sub-parts to supply it and all fourteen `surface` sites
 * hold plain content instead. Composing `CardHeader`/`CardContent` inside a
 * `surface` card therefore pads twice — pass `p-0`, or use `default`.
 */

/**
 * Which ground the card paints. See the file header for why `surface` is a
 * variant and not a second component.
 *
 * `surface` is flat by rule, not by taste — principles.md 16: a flat panel
 * takes a border, not a shadow. It carries `block no-underline` itself because
 * six of its fourteen call sites are anchors and those two utilities are the
 * only thing they were adding. Both are inert on the `<div>` this defaults to,
 * and a call site that wants `flex flex-col` still wins the `display` conflict
 * through `cn`.
 */
export type CardVariant = "default" | "surface";

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground shadow",
  surface: "block border border-surface-border bg-surface-1 p-[24px] no-underline",
};

export interface CardProps {
  /** See `CardVariant`. Defaults to `default`, which is byte-identical to what this shipped as. */
  variant?: CardVariant;
  /**
   * Render as the single child instead of a `<div>` — same mechanism `Button`
   * uses. This is what lets a `surface` card be a real `<a>` or a `next/link`
   * rather than a card with an anchor stuffed inside it, which is what the six
   * near-copies were working around.
   */
  asChild?: boolean;
}

function Card({
  className,
  variant = "default",
  asChild = false,
  ...props
}: CardProps & React.ComponentProps<"div">) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="card"
      className={cn("rounded-xl", CARD_VARIANTS[variant], className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
