import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ZodObject, z } from "zod";

// An available HTML tag
type Tag =
  | "input"
  | "button"
  | "textarea"
  | "img"
  | "label"
  | "div"
  | "span"
  | "form";

// Reflects a Tag to its HTML element type
type Element<T extends Tag> = T extends "input"
  ? HTMLInputElement
  : T extends "button"
    ? HTMLButtonElement
    : T extends "textarea"
      ? HTMLTextAreaElement
      : T extends "img"
        ? HTMLImageElement
        : T extends "label"
          ? HTMLLabelElement
          : T extends "div"
            ? HTMLDivElement
            : T extends "span"
              ? HTMLSpanElement
              : T extends "form"
                ? HTMLFormElement
                : never;

// The attributes for a given HTML element
type Attributes<T extends HTMLElement> = T extends HTMLInputElement
  ? React.InputHTMLAttributes<T>
  : T extends HTMLButtonElement
    ? React.ButtonHTMLAttributes<T>
    : T extends HTMLTextAreaElement
      ? React.TextareaHTMLAttributes<T>
      : T extends HTMLImageElement
        ? React.ImgHTMLAttributes<T>
        : T extends HTMLFormElement
          ? React.FormHTMLAttributes<T>
          : React.HTMLAttributes<T>;

// The props of a styled variant component
type Props<
  T extends Tag,
  V extends (...args: any) => any = () => {},
> = Attributes<Element<T>> & VariantProps<V>;

// The render function within the styled util
interface RenderFunction<
  T extends Tag,
  V extends (...args: any) => any,
  S extends z.Schema,
> {
  (
    args: {
      props: Props<T, V> & z.infer<S>;
      ref: React.ForwardedRef<Element<T>> | React.LegacyRef<Element<T>>;
      cn: (props: VariantProps<V> & { className?: string }) => string;
      schema?: S;
    },
    displayName?: string,
  ): React.ReactElement | null;
}

/**
 * Creates a styled component with cva variants, and optionally an extended zod schema for additional props.
 * @param {Tag} tag - The HTML tag to use
 * @param {(...args: any) => any} variants - cva function with default className, and optionally variants.
 * @param {z.Schema} schema - zod schema for additional props
 * @returns {RenderFunction}
 * @example
 * import { styled } from "lib/utils/styled";
 * import { cva } from "class-variance-authority";
 * const Button = styled("button", cva("...default classnames...", {
 *   variants: {
 *     size: {
 *       ...variants
 *     }
 *   }
 * }))(({ props }) => <button {...props}/>)
 */
export function styled<
  T extends Tag,
  V extends (...args: any) => any,
  S extends z.Schema = ZodObject<{}>,
>(tag: T, variants: V, schema?: S) {
  return (callback: RenderFunction<T, V, S>, displayName?: string) => {
    const comp = React.forwardRef(
      (
        props: Props<T, V> & z.infer<S>,
        ref: React.ForwardedRef<Element<typeof tag>>,
      ) => {
        return callback({
          props,
          ref,
          schema,
          cn: (_props) => cn(variants(_props)),
        });
      },
    );

    comp.displayName = displayName || tag;
    return comp;
  };
}

export type Infer<T> = T extends React.ComponentType<infer P> ? P : never;
