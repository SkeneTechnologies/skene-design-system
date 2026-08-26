import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
declare const HoverCard: React.FC<HoverCardPrimitive.HoverCardProps>;
declare const HoverCardTrigger: React.ForwardRefExoticComponent<HoverCardPrimitive.HoverCardTriggerProps & React.RefAttributes<HTMLAnchorElement>>;
declare const HoverCardPortal: React.FC<HoverCardPrimitive.HoverCardPortalProps>;
declare function HoverCardContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>): React.JSX.Element;
export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardPortal };
//# sourceMappingURL=hover-card.d.ts.map