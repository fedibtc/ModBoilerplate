import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ZodObject, z } from "zod";

type Tag = "input" | "button" | "textarea" | "img" | "label" | "div" | "span" | "form";

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

type Props<
  T extends Tag,
  V extends (...args: any) => any = () => {},
> = Attributes<Element<T>> & VariantProps<V>;

interface RenderFunction<
  T extends Tag,
  V extends (...args: any) => any,
  S extends z.Schema,
> {
  (args: {
    props: Props<T, V> & z.infer<S>;
    ref: React.ForwardedRef<Element<T>> | React.LegacyRef<Element<T>>;
    cn: (props: VariantProps<V> & { className?: string }) => string;
    schema?: S;
  }): React.ReactElement | null;
  displayName?: string;
}

export function styled<
  T extends Tag,
  V extends (...args: any) => any,
  S extends z.Schema = ZodObject<{}>,
>(tag: T, variants: V, schema?: S) {
  return (callback: RenderFunction<T, V, S>) =>
    React.forwardRef(
      (
        props: Props<T, V> & z.infer<S>,
        ref: React.ForwardedRef<Element<typeof tag>>,
      ) =>
        callback({
          props,
          ref,
          schema,
          cn: (_props) => cn(variants(_props)),
        }),
    );
}

export type Infer<T> = T extends React.ComponentType<infer P> ? P : never;