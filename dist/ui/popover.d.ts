import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
declare const Popover: React.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const PopoverAnchor: React.ForwardRefExoticComponent<PopoverPrimitive.PopoverAnchorProps & React.RefAttributes<HTMLDivElement>>;
declare function PopoverContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>): React.JSX.Element;
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
//# sourceMappingURL=popover.d.ts.map