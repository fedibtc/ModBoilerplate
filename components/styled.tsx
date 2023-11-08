import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

type Attributes<T extends HTMLElement> = T extends HTMLInputElement
  ? React.InputHTMLAttributes<T>
  : T extends HTMLButtonElement
  ? React.ButtonHTMLAttributes<T>
  : T extends HTMLTextAreaElement
  ? React.TextareaHTMLAttributes<T>
  : T extends HTMLImageElement
  ? React.ImgHTMLAttributes<T>
  : T extends HTMLLabelElement
  ? React.LabelHTMLAttributes<T>
  : React.HTMLAttributes<T>;

export default function styled<
  El extends HTMLElement = HTMLDivElement,
  AdditionalProps extends {} = {},
  T extends (...args: any) => any = () => {},
>(variants: T) {
  type Props = Attributes<El> & VariantProps<T> & AdditionalProps;
  interface RenderFunction {
    (
      props: Props,
      ref: React.ForwardedRef<El>,
      cn: (props: VariantProps<T> & { className?: string }) => string,
    ): React.ReactElement | null;
  }

  return (callback: RenderFunction) =>
    React.forwardRef((props: Props, ref: React.ForwardedRef<El>) =>
      callback(props, ref, (_props) => cn(variants(_props))),
    );
}
