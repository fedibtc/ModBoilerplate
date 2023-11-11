"use client";

import Container from "@/components/container";
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
    <Container>
      <div className="flex flex-col gap-lg rounded-[8px] p-[48px] bg-white drop-shadow-xl sm:p-[20px] sm:drop-shadow-sm">
        <Link href="/" className="text-grey inline-flex gap-sm items-center">
          <Icon icon="IconChevronLeft" />
          <span>Home</span>
        </Link>
      </div>
      <Typography />
      <Buttons />
      <FormFields />
      <Avatars />
      <Toasts />
      <Dialogs />
    </Container>
  );
}
