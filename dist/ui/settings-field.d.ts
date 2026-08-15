import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Input } from "./input.js";
import { Switch } from "./switch.js";
declare const settingsFieldVariants: (props?: ({
    tone?: "default" | "muted" | null | undefined;
    validation?: "none" | "destructive" | "warning" | "error" | "success" | null | undefined;
    mono?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const settingsSelectVariants: (props?: ({
    size?: "default" | "sm" | null | undefined;
    tone?: "default" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type SettingsFieldVariantProps = VariantProps<typeof settingsFieldVariants>;
export interface SettingsInputProps extends React.ComponentProps<typeof Input>, Pick<SettingsFieldVariantProps, "validation" | "mono"> {
    tone?: SettingsFieldVariantProps["tone"];
}
declare function SettingsInput({ className, disabled, tone, validation, mono, ...props }: SettingsInputProps): React.JSX.Element;
export interface SettingsSelectProps extends Omit<React.ComponentProps<"select">, "size">, VariantProps<typeof settingsSelectVariants> {
}
declare function SettingsSelect({ className, size, disabled, children, ...props }: SettingsSelectProps): React.JSX.Element;
export interface SettingsSwitchProps extends React.ComponentProps<typeof Switch> {
    label?: string;
    labelPosition?: "left" | "right";
    labelClassName?: string;
    description?: string;
}
declare function SettingsSwitch({ className, label, labelPosition, labelClassName, description, id, disabled, ...props }: SettingsSwitchProps): React.JSX.Element;
export { SettingsInput, SettingsSelect, SettingsSwitch, settingsFieldVariants, settingsSelectVariants, };
//# sourceMappingURL=settings-field.d.ts.map