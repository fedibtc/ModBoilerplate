import Icon, { IconKey } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import * as React from "react";
import { styled } from "react-tailwind-variants";

const buttonVariants = cva(
  "relative inline-flex justify-center items-center font-medium rounded-[40px] border-0 no-underline decoration-transparent decoration-0 cursor-pointer transition-button disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary bg-gradient-to-b from-white/20 to-transparent text-white hover:brightness-125 active:brightness-150",
        secondary:
          "bg-white bg-gradient-to-b from-white to-primary/10 shadow-secondary-inset hover:brightness-95 active:brightness-90",
        tertiary:
          "bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10",
        outline:
          "bg-transparent text-primary !border-solid !border-2 !border-primary hover:bg-primary/5 active:bg-primary/10",
      },
      size: {
        md: "h-xxl px-xxl text-sm",
        sm: "h-[32px] px-[26px] text-sm",
        xs: "h-xl px-20 text-xs",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
      },
      loading: {
        true: "",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        loading: true,
        className: "opacity-100",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>,
    VariantProps<typeof buttonVariants> {
  icon?: IconKey;
}

type ButtonLinkProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> &
  Omit<LinkProps, keyof BaseProps>;

type ButtonExternalLinkProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;

type Props = ButtonProps | ButtonLinkProps | ButtonExternalLinkProps;

/**
 * A button.
 */
const Button = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      variant,
      size,
      disabled,
      width,
      loading = false,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        <ButtonContent loading={loading}>
          {"icon" in props && typeof props.icon === "string" ? (
            <Icon size="xs" icon={props.icon} />
          ) : null}
          <div>{children}</div>
        </ButtonContent>
        <ButtonLoader loading={loading}>
          <Icon size="xs" icon="IconLoader2" className="animate-load" />
        </ButtonLoader>
      </>
    );

    const sharedProps = {
      variant,
      size,
      width,
      disabled: Boolean(disabled || loading),
      onClick:
        disabled || loading
          ? undefined
          : (onClick as React.MouseEventHandler<HTMLElement>),
      className: cn(
        buttonVariants({ variant, size, disabled, width, loading, className }),
      ),
    };

    if ("href" in props && props.href !== undefined) {
      if (typeof props.href === "string" && props.href.startsWith("http")) {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={props.href || ""}
            {...(props as React.HTMLAttributes<HTMLAnchorElement>)}
            {...sharedProps}
          >
            {content}
          </a>
        );
      } else {
        return (
          <Link
            href={props.href || ""}
            {...(props as React.HTMLAttributes<HTMLAnchorElement>)}
            {...sharedProps}
          >
            {content}
          </Link>
        );
      }
    } else {
      return (
        <button
          ref={ref}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          {...sharedProps}
        >
          {content}
        </button>
      );
    }
  },
);
Button.displayName = "Button";

const ButtonContent = styled("div", {
  base: "flex items-center gap-2 transition-[opacity 100ms ease]",
  variants: {
    loading: {
      true: "opacity-0",
    },
  },
});

const ButtonLoader = styled("div", {
  base: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0",
  variants: {
    loading: {
      true: "opacity-100",
    },
  },
});

export { Button };
