"use client";

import Icon from "@/components/ui/icon";
import Link from "next/link";
import Avatars from "./avatars";
import Buttons from "./buttons";
import Dialogs from "./dialogs";
import FormFields from "./form-fields";
import Toasts from "./toasts";
import Typography from "./typography";

export default function Playground() {
  return (
    <div className="w-full min-h-screen bg-holo-400 flex justify-center">
      <div className="min-h-full max-w-[480px] w-full flex flex-col gap-lg grow">
        <div className="py-xl rounded-lg flex flex-col gap-lg grow items-stretch w-full">
          <Link
            href="/"
            className="text-grey inline-flex gap-sm items-center w-full bg-white p-sm rounded-lg drop-shadow-xl"
          >
            <Icon icon="IconChevronLeft" />
            <span>Home</span>
          </Link>
          <Typography />
          <Buttons />
          <FormFields />
          <Avatars />
          <Toasts />
          <Dialogs />
        </div>
      </div>
    </div>
  );
}
