import { Checkbox } from "@/components/ui/checkbox";
import { ComponentProps, useCallback } from "react";

type CheckboxProps = ComponentProps<typeof Checkbox>;

interface CheckboxOption<T extends string>
  extends Omit<CheckboxProps, "onChange" | "checked"> {
  value: T;
}

export interface CheckboxGroupProps<T extends string> {
  options: CheckboxOption<T>[];
  values: T[] | undefined;
  disabled?: boolean;
  onChange(values: T[]): void;
}

/**
 * A group of Checkboxes
 */
export function CheckboxGroup<T extends string>({
  options,
  values,
  onChange,
  ...props
}: CheckboxGroupProps<T>) {
  const handleChange = useCallback(
    (checked: boolean, value: T) => {
      if (checked) {
        onChange([...(values || []), value]);
      } else {
        onChange(values?.filter((v) => v !== value) || []);
      }
    },
    [values, onChange],
  );

  return (
    <div className="flex flex-col gap-10">
      {options.map(({ value, disabled, ...checkboxProps }) => (
        <Checkbox
          key={value}
          onChange={(checked) => handleChange(checked, value)}
          checked={!!values?.includes(value)}
          disabled={disabled || props.disabled}
          {...checkboxProps}
        />
      ))}
    </div>
  );
}
