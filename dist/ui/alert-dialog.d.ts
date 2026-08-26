import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
declare const AlertDialog: React.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): React.JSX.Element;
declare function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>): React.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): React.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): React.JSX.Element;
declare function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>): React.JSX.Element;
declare function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>): React.JSX.Element;
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
//# sourceMappingURL=alert-dialog.d.ts.map