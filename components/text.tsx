import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const textVariants = cva(
  "text-inherit text-base font-normal leading-5 tracking-[-1%]",
  {
    variants: {
      variant: {
        display: "!font-bolder text-[80px] leading-[1.5]",
        h1: "!font-bolder text-[32px] leading-[1.5]",
        h2: "!font-bolder text-2xl leading-[1.5]",
        body: "text-base",
        caption: "text-sm",
        small: "text-xs",
        tiny: "text-[10px]"
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-semibold",
        bolder: "font-bold"
      },
      ellipsize: {
        true: "truncate"
      }
    },
    defaultVariants: {
      ellipsize: false,
      variant: "body",
      weight: "normal"
    },
  },
);

export interface TextProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof textVariants> {
}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ className, variant, weight, ellipsize, ...props }, ref) => {
    return (
      <div
        className={cn(textVariants({ variant, weight, ellipsize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
