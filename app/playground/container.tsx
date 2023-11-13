import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Container({
  className,
  children,
  title,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-lg rounded-lg p-xl bg-white drop-shadow-xl sm:p-lx sm:drop-shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-10">
        <Text variant="h1" weight="bolder">
          {title}
        </Text>
        <div className="w-full h-xs bg-holo-600" />
      </div>
      {children}
    </div>
  );
}
