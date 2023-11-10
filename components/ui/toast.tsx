import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "bottom-0 right-0 sm:top-0 sm:bottom-auto sm:right-1/2 sm:translate-x-1/2 fixed z-[100] flex max-h-screen w-full flex-col-reverse px-[20px] py-[30px] max-w-[360px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  `group max-w-[320px] pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[20px] border border-lightGrey p-[20px] shadow-[0_4px_24px_0_rgba(0,0,0,0.1)] bg-holo-400 transition-all 
  data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:translate-y-0
  data-[swipe=end]:min-sm:translate-x-[var(--radix-toast-swipe-end-x)] 
  data-[swipe=end]:sm:translate-y-[var(--radix-toast-swipe-end-y)] 
  data-[swipe=move]:min-sm:translate-x-[var(--radix-toast-swipe-move-x)] 
  data-[swipe=move]:sm:translate-y-[var(--radix-toast-swipe-move-y)] 
  data-[swipe=move]:transition-none 
  data-[swipe=end]:animate-out
  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:min-sm:slide-out-to-right-full data-[state=closed]:sm:slide-out-to-top-full data-[state=open]:min-sm:slide-in-from-right-full data-[state=open]:sm:slide-in-from-top-full`,
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      style={{ backgroundColor: 'white' }}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastContent = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastContent.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export {
  Toast,
  ToastContent,
  ToastProvider,
  ToastViewport,
  type ToastProps,
};
