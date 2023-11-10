import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function Container({ className, children, title, ...props }: HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <div className={cn("flex flex-col gap-[20px] rounded-[20px] p-[48px] bg-white drop-shadow-2x sm:p-[20px] sm:drop-shadow-md sm:rounded-none", className)} {...props}>
      <div className="flex flex-col gap-[10px]">
        <Text variant="h1" weight="bolder">{title}</Text>
        <div className="w-full h-[4px] bg-holo-600" />
      </div>
      {children}
    </div>
  );
}