import { Text } from "@/components/ui/text";
import { StyledProps, styled } from "@/components/ui/utils/styled";
import { cn } from "@/lib/utils";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

type TextProps = StyledProps<typeof Text>;

interface RadioOption<T extends string> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string> {
  options: readonly RadioOption<T>[];
  value: T | undefined;
  disabled?: boolean;
  labelTextProps?: TextProps;
  onChange(value: T): void;
}

/**
 * A group of Radio Buttons.
 */
export function RadioGroup<T extends string>({
  options,
  onChange,
  labelTextProps,
  ...props
}: RadioGroupProps<T>): React.ReactElement {
  return (
    <Root onValueChange={onChange} {...props}>
      {options.map(({ value, label, disabled }) => (
        <Item key={value} disabled={props.disabled || disabled}>
          <Radio
            value={value}
            checked={props.value === value}
            disabled={props.disabled || disabled}
          >
            <RadioIndicator />
          </Radio>
          <Label disabled={props.disabled || disabled}>
            <Text variant="caption" weight="medium" {...labelTextProps}>
              {label}
            </Text>
          </Label>
        </Item>
      ))}
    </Root>
  );
}

const Root = styled(RadixRadio.Root, cva("flex flex-col gap-10"));

const Item = styled(
  "label",
  cva("flex items-center gap-10 cursor-pointer", {
    variants: {
      disabled: {
        true: "cursor-not-allowed",
      },
    },
  }),
);

const Radio = styled(
  RadixRadio.Item,
  cva(
    "relative inline-flex items-center justify-center p-0 w-[22px] h-[22px] bg-white border-2 border-solid border-primary rounded-full cursor-pointer disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:cursor-not-allowed disabled:cursor-not-allowed",
  ),
);

const RadioIndicator: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <RadixRadio.Indicator
    {...props}
    className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full data-[state=checked]:bg-primary",
      className,
    )}
  />
);

const Label = styled(
  "div",
  cva("", {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  }),
);
