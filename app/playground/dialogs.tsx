import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogStatus } from "@/components/ui/dialog/status";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio";
import { useCallback, useEffect, useState } from "react";
import Container from "./container";

export default function Dialogs() {
  const sizes = ["sm", "md", "lg"] as const;
  type Size = (typeof sizes)[number];

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<Size>("md");
  const [statusType, setStatusType] = useState<"error" | "success">("success");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "loading">();

  useEffect(() => {
    if (!open) {
      setValue1("");
      setValue2("");
      setStatus(undefined);
    }
  }, [open]);

  const handleSubmit = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      setStatus("loading");
      setTimeout(() => {
        setStatus(statusType);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      }, 2000);
    },
    [statusType],
  );

  return (
    <Container title="Dialog">
      <div className="flex gap-md">
        <div>
          Size
          <RadioGroup
            options={sizes.map((s) => ({ value: s, label: s }))}
            value={size}
            onChange={(s) => setSize(s as Size)}
          />
        </div>
        <div>
          Status
          <RadioGroup
            options={["success", "error"].map((s) => ({ value: s, label: s }))}
            value={statusType}
            onChange={(s) => setStatusType(s as "error" | "success")}
          />
        </div>
      </div>
      <Button onClick={() => setOpen(true)}>Open a Dialog</Button>
      <Dialog
        title="Dialog title"
        description="This is a description for the dialog."
        size={size}
        open={open}
        onOpenChange={setOpen}
      >
        <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
          <Input
            label="Field one"
            value={value1}
            onChange={(ev) => setValue1(ev.currentTarget.value)}
          />

          <Input
            label="Field two"
            value={value2}
            onChange={(ev) => setValue2(ev.currentTarget.value)}
          />
          <div className="flex gap-sm">
            <Button type="submit">Save</Button>
            <Button
              type="submit"
              variant="tertiary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
        {status && (
          <DialogStatus
            status={status}
            title={`I am ${status}`}
            description="This is a description"
          />
        )}
      </Dialog>
    </Container>
  );
}
