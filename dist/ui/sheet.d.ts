import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
declare const Sheet: React.FC<DialogPrimitive.DialogProps>;
declare const SheetTrigger: React.ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React.ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
    side?: "right" | "left";
}
declare function SheetContent({ className, children, side, ...props }: SheetContentProps): React.JSX.Element;
declare function SheetHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): React.JSX.Element;
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, };
//# sourceMappingURL=sheet.d.ts.map