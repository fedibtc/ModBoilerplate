import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import React from "react";

/**
 * Gets the props of a styled component
 */
export type StyledProps<T> = T extends React.ComponentType<infer P> ? P : never;

/**
 * Creates a styled tailwind component with variants with class-variance-authority
 * @param {React.ElementType} Component - The component to style
 * @param {V} variants - A `cva` function with variants
 */
export function styled<
  C extends React.ElementType,
  V extends ((...args: any) => any) | string,
>(Component: C, variants: V) {
  const Comp = React.forwardRef<
    HTMLElement,
    React.ComponentProps<C> &
      (V extends (...args: any) => any ? VariantProps<V> : {})
  >(({ as, className, ...props }, ref) => {
    const Element = as || Component;

    return (
      <Element
        ref={ref}
        className={cn(
          typeof variants === "string" ? variants : variants(props),
          className,
        )}
        {...props}
      />
    );
  });
  Comp.displayName =
    typeof Component === "string"
      ? Component
      : Component.displayName || Component.name || "Component";

  return Comp;
}
