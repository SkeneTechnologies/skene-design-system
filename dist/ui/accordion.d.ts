import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
declare const Accordion: React.ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & React.RefAttributes<HTMLDivElement>>;
declare function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>): React.JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>): React.JSX.Element;
declare function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>): React.JSX.Element;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
//# sourceMappingURL=accordion.d.ts.map