"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils.js";
const Tabs = TabsPrimitive.Root;
function TabsList({ className, ...props }) {
    return (_jsx(TabsPrimitive.List, { "data-slot": "tabs-list", className: cn("inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className), ...props }));
}
function TabsTrigger({ className, ...props }) {
    return (_jsx(TabsPrimitive.Trigger, { "data-slot": "tabs-trigger", className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-foreground", className), ...props }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Content, { "data-slot": "tabs-content", className: cn("mt-2 focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]", className), ...props }));
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
