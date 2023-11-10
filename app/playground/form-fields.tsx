import { useState } from "react";
import Container from "./container";
import { Text } from '@/components/ui/text';
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Input } from "@/components/ui/input";

export default function FormFields() {
  const [oneChecked, setOneChecked] = useState(false);
  const [twoChecked, setTwoChecked] = useState(true);

  const [checkboxGroupValues, setCheckboxGroupValues] = useState(["one"]);
  const [radioGroupValue, setRadioGroupValue] = useState("one");

  const [inputOneValue, setInputOneValue] = useState("");

  const groupOptions = [
    {
      label: "Group option one",
      value: "one",
    },
    {
      label: "Group option two",
      value: "two",
    },
    {
      label: "Group option three",
      value: "three",
      disabled: true,
    },
  ];

  return (
    <Container title="Form Fields">
      <div className="flex flex-col gap-[10px]">
        <Text variant="h2">Solo Checkboxes</Text>

        <div className="flex flex-col gap-[10px]">
          <Checkbox
            checked={oneChecked}
            onChange={setOneChecked}
            label="Default unchecked"
          />
          <Checkbox
            checked={twoChecked}
            onChange={setTwoChecked}
            defaultChecked
            label="Default checked"
          />
          <Checkbox checked={true} label="Disabled checked" disabled />
          <Checkbox checked={false} label="Disabled unchecked" disabled />
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <Text variant="h2">Radio group</Text>
        <RadioGroup
          options={groupOptions}
          value={radioGroupValue}
          onChange={setRadioGroupValue}
        />
      </div>

      <div className="flex flex-col gap-[10px]">
        <Text variant="h2">Checkbox group</Text>
        <CheckboxGroup
          options={groupOptions}
          values={checkboxGroupValues}
          onChange={setCheckboxGroupValues}
        />
      </div>

      <div className="flex flex-col gap-[10px]">
        <Text variant="h2">Inputs</Text>
        <Input
          label="Default input"
          value={inputOneValue}
          onChange={(ev) => setInputOneValue(ev.currentTarget.value)}
          placeholder="Placeholder text"
        />
        <Input
          label="Disabled input"
          value=""
          placeholder="Placeholder text"
          disabled
        />
      </div>
    </Container>
  );
}