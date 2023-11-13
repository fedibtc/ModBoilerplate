import { Infer, styled } from "@/components/ui/utils/styled";
import { cva } from "class-variance-authority";

/**
 * Text Component with all the typography styles.
 */
export const Text = styled(
  "div",
  cva("text-inherit text-body leading-5 tracking-[-1%]", {
    variants: {
      variant: {
        display: "font-bolder text-display leading-[1.5]",
        h1: "font-bolder text-h1 leading-[1.5]",
        h2: "font-bolder text-h2 leading-[1.5]",
        body: "text-base",
        caption: "text-sm",
        small: "text-xs",
        tiny: "text-tiny",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-semibold",
        bolder: "font-bold",
      },
      ellipsize: {
        true: "truncate",
      },
    },
    defaultVariants: {
      ellipsize: false,
      variant: "body",
      weight: "normal",
    },
  }),
)(({ props: { className, variant, weight, ellipsize, ...props }, ref, cn }) => (
  <div
    className={cn({ variant, weight, ellipsize, className })}
    {...props}
    ref={ref}
  />
));

export type TextProps = Infer<typeof Text>;
