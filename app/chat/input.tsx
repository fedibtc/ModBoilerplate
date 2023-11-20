import Icon from "@/components/ui/icon";
import { Dispatch, SetStateAction } from "react";

export default function ChatInput({
  onSubmit,
  loading = false,
  ...props
}: {
  onSubmit?: () => void;
  loading?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>) {
  return (
    <div className="flex focus-within:!border-blue items-center px-md">
      <input
        className="border-none py-lg text-base w-full outline-none disabled:opacity-50"
        disabled={loading}
        {...props}
      />
      <button
        onClick={typeof onSubmit !== "undefined" ? () => onSubmit() : undefined}
        type={typeof onSubmit !== "undefined" ? "button" : "submit"}
        disabled={loading}
        className="bg-blue rounded-full w-8 h-8 p-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <Icon
          icon={loading ? "IconLoader2" : "IconArrowUp"}
          size="sm"
          className={"text-white" + (loading ? " animate-load" : "")}
          stroke={3}
        />
      </button>
    </div>
  );
}
