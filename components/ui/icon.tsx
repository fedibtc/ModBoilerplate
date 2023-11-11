import * as Icons from "@tabler/icons-react";
import { TablerIconsProps } from "@tabler/icons-react";

const sizes = {
  xxs: 12,
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export type IconKey = Exclude<keyof typeof Icons, "createReactComponent">;

export interface IconProps extends TablerIconsProps {
  icon: IconKey;
  size?: keyof typeof sizes | number;
}

/**
 * Renders an icon component from Tabler Icons.
 */
export default function Icon({ icon, size = "xs", ...props }: IconProps) {
  const Comp = Icons[icon];

  return (
    <Comp size={typeof size === "number" ? size : sizes[size]} {...props} />
  );
}
