import Icon from "@/components/ui/icon";
import { Dispatch, SetStateAction } from "react";

export default function ChatInput({
  onSubmit,
  value,
  setValue,
  loading,
}: {
  onSubmit: () => void;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  loading: boolean;
}) {
  return (
    <div className="flex focus-within:!border-blue items-center px-md">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Send a message..."
        className="border-none py-lg text-base w-full outline-none disabled:opacity-50"
        disabled={loading}
      />
      <button
        onClick={() => onSubmit()}
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
