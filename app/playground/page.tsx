"use client";

import Avatars from "./avatars";
import Buttons from "./buttons";
import Dialogs from "./dialogs";
import FormFields from "./form-fields";
import Toasts from "./toasts";
import Typography from "./typography";

export default function Playground() {
  return (
    <div className="flex flex-col gap-[36px] sm:gap-[10px] p-[36px] sm:p-0 bg-holo-100">
      <Typography />
      <Buttons />
      <FormFields />
      <Avatars />
      <Toasts />
      <Dialogs />
    </div>
  );
}
