"use client";

import { useToast } from "@/components/ui/hooks/use-toast";
import { cn } from "@/lib/utils";
import * as RadixToast from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useEffect, useState } from "react";

/**
 * Toaster component that displays a toast message on top of the page.
 * Should be placed in the page layout.
 */
export function Toaster() {
  const [sm, setSm] = useState(false);
  const { toasts } = useToast();

  useEffect(() => {
    const resize = () => {
      setSm(window.innerWidth < 600);
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <RadixToast.Provider swipeDirection={sm ? "up" : "right"} duration={2000}>
      {toasts.map(function ({ id, content, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {content && <ToastContent>{content}</ToastContent>}
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </RadixToast.Provider>
  );
}

const ToastViewport = forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Viewport>
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport
    ref={ref}
    className={cn(
      "bottom-[32px] right-20 sm:bottom-auto sm:right-1/2 sm:top-[32px] sm:translate-x-1/2 fixed z-[2147483647] flex max-h-screen w-full flex-col-reverse max-w-[320px] outline-0 list-style-none p-0",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

export const toastVariants = cva(
  `group max-w-[320px] pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[20px] border border-lightGrey p-20 shadow-[0_4px_24px_0_rgba(0,0,0,0.1)] bg-holo-400 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:translate-y-0 data-[swipe=end]:min-sm:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:sm:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:min-sm:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:sm:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[swipe=end]:animate-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:min-sm:slide-out-to-right-full data-[state=closed]:sm:slide-out-to-top-full data-[state=open]:min-sm:slide-in-from-right-full data-[state=open]:sm:slide-in-from-top-full`,
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

const Toast = forwardRef<
  React.ElementRef<typeof RadixToast.Root>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <RadixToast.Root
      ref={ref}
      style={{ backgroundColor: "white" }}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastContent = forwardRef<
  React.ElementRef<typeof RadixToast.Description>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Description>
>(({ className, ...props }, ref) => (
  <RadixToast.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastContent.displayName = "ToastContent";
