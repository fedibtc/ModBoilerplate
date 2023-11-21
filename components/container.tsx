import { cn } from "@/lib/utils";
import React from "react";

export default function Container({
  children,
  center = false,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div
        className={cn(
          `flex flex-col gap-lg items-center justify-center grow w-full ${
            center ? "" : "h-full"
          } max-w-[480px]`,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
