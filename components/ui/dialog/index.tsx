"use client";

import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as RadixDialog from "@radix-ui/react-dialog";
import { VariantProps, cva } from "class-variance-authority";
import React, { useCallback } from "react";

/**
 * A controlled Dialog component.
 */
export const Dialog = ({
  title,
  description,
  open,
  onOpenChange,
  children,
  size,
  disableClose,
}: {
  open: boolean;
  onOpenChange(open: boolean): void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  disableClose?: boolean;
}) => {
  const handleCloseTrigger = useCallback(
    (ev: Event) => {
      if (disableClose) ev.preventDefault();
    },
    [disableClose],
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <DialogOverlay>
          <DialogContent
            size={size}
            onOpenAutoFocus={(ev) => ev.preventDefault()}
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
              <RadixDialog.Close className="absolute top-lg right-lg p-xs opacity-50 outline-0 cursor-pointer z-[100] hover:opacity-100 focus:opacity-100 sm:top-[18px] sm:right-[18px]">
                <Icon icon="IconX" size="xs" />
              </RadixDialog.Close>
            )}
          </DialogContent>
        </DialogOverlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 grid place-items-center overflow-auto bg-primary/80 sm:p-0 sm:items-start sm:bg-secondary animate-overlayShow",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const contentVariants = cva(
  "relative flex flex-col p-[32px] rounded-[20px] w-[90vw] bg-white overflow-hidden sm:p-[24px] sm:w-full sm:h-full sm:rounded-none sm:!max-w-none xs:p-[16px] animate-contentShow",
  {
    variants: {
      size: {
        sm: "max-w-[340px]",
        md: "max-w-[500px]",
        lg: "max-w-[640px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content> &
  VariantProps<typeof contentVariants>
>(({ className, children, size, ...props }, ref) => (
  <RadixDialog.Content
    ref={ref}
    className={cn(contentVariants({ size, className }))}
    {...props}
  >
    {children}
  </RadixDialog.Content>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("sm:text-center flex flex-col gap-sm", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title ref={ref} className={className} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn("text-darkGrey mb-20", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
