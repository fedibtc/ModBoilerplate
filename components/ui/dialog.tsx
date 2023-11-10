"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Text } from '@/components/ui/text';
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { useCallback } from "react";

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 grid place-items-center overflow-auto bg-primary/80 sm:p-0 sm:items-start sm:bg-secondary animate-overlayShow",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const contentVariants = cva(
  "relative flex flex-col p-[32px] rounded-[20px] w-[90vw] bg-white overflow-hidden sm:p-[24px] sm:w-full sm:h-full sm:rounded-none sm:!max-w-none xs:p-[16px] animate-contentShow",
  {
    variants: {
      size: {
        sm: "max-w-[340px]",
        md: "max-w-[500px]",
        lg: "max-w-[640px]",
      }
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & VariantProps<typeof contentVariants>
>(({ className, children, size, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      contentVariants({ size, className }),
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sm:text-center",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "mb-[8px]",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-darkGrey mb-[20px]", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const Dialog = ({
  title,
  description,
  open,
  onOpenChange,
  children,
  size,
  disableClose
}: {
  open: boolean
  onOpenChange(open: boolean): void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  disableClose?: boolean
}) => {
  const handleCloseTrigger = useCallback(
    (ev: Event) => {
      if (disableClose) ev.preventDefault()
    },
    [disableClose],
  )

  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogOverlay>
        <DialogContent
          size={size}
          onOpenAutoFocus={ev => ev.preventDefault()}
          onEscapeKeyDown={handleCloseTrigger}
          onPointerDownOutside={handleCloseTrigger}
          onInteractOutside={handleCloseTrigger}
        >
          {(title || description) && (
            <DialogHeader>
              {title && (
                <DialogTitle>
                  <Text variant="body" weight="bold">
                    {title}
                  </Text>
                </DialogTitle>
              )}
              {description && (
                <DialogDescription>
                  <Text variant="caption" weight="medium">
                    {description}
                  </Text>
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className="grow flex flex-col">{children}</div>
          {!disableClose && (
            <DialogClose className="absolute top-[16px] right-[16px] p-[4px] opacity-50 outline-0 cursor-pointer z-[100] hover:opacity-100 focus:opacity-100 sm:top-[18px] sm:right-[18px]">
              <Icon icon="IconX" size="xs" />
            </DialogClose>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
}
