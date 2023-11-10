"use client";

import {
  Toast,
  ToastProvider,
  ToastContent,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/hooks/use-toast";
import { useEffect, useState } from "react";

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
    <ToastProvider swipeDirection={sm ? "up" : "right"} duration={2000}>
      {toasts.map(function({ id, content, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {content && (
                <ToastContent>{content}</ToastContent>
              )}
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
