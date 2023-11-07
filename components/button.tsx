import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex justify-center items-center font-medium rounded-[40px] border-0 no-underline decoration-transparent decoration-0	cursor-pointer transition-[background-color 100ms ease, filter 100ms ease, opacity 100ms ease] disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        tertiary: "",
        outline: "",
      },
      size: {
        md: "",
        sm: "",
        xs: ""
      },
      width: {
        auto: "",
        full: ""
      },
      disabled: {
        true: "pointer-events-none opacity-50"
      },
      loading: {
        true: ""
      }
    },
    compoundVariants: [
      {
        disabled: true,
        loading: true,
        className: "opacity-100"
      }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const buttonContentVariants = cva(
  "flex items-center gap-2 transition-[opacity 100ms ease]",
  {
    variants: {
      loading: {
        true: {
          opacity: 0
        }
      }
    }
  }
)

const buttonLoaderVariants = cva(
  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0",
  {
    variants: {
      loading: {
        true: "opacity-100"
      }
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const ButtonContent = () => {

}

const ButtonLoader = () => {

}

export { Button, buttonVariants };
