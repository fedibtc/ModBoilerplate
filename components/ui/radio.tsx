import { Text } from "@/components/ui/text";
import { Infer, styled } from "@/components/ui/utils/styled";
import { cn } from "@/lib/utils";
import * as RadixLabel from "@radix-ui/react-label";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import { z } from "zod";

type TextProps = Infer<typeof Text>;

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
    // @ts-expect-error Type param issue with Zod
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

const Root = styled(
  "div",
  cva("flex flex-col gap-[10px]"),
  z.object({
    name: z.string().optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    dir: z.enum(["ltr", "rtl"]).optional(),
    orientation: z.enum(["horizontal", "vertical"]).optional(),
    loop: z.boolean().optional(),
    defaultValue: z.string().optional(),
    value: z.string().optional(),
    onValueChange: z.function(z.tuple([z.string()]), z.void()),
  }),
)(({ props: { className, ...props }, cn }) => (
  <RadixRadio.Root {...props} className={cn({ className })} />
));

const Item = styled(
  "label",
  cva("flex items-center gap-[10px] cursor-pointer", {
    variants: {
      disabled: {
        true: "cursor-not-allowed",
      },
    },
  }),
)(({ props: { className, ...props }, cn }) => (
  <RadixLabel.Label {...props} className={cn({ className })} />
));

const Radio = styled(
  "button",
  cva(
    "relative inline-flex items-center justify-center p-0 w-[22px] h-[22px] bg-white border-2 border-solid border-primary rounded-full cursor-pointer disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:cursor-not-allowed disabled:cursor-not-allowed",
  ),
  z.object({
    value: z.string(),
    checked: z.boolean().optional(),
  }),
)(({ props: { className, value, ...props }, cn }) => (
  <RadixRadio.Item {...props} value={value} className={cn({ className })} />
));

const RadioIndicator: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <RadixRadio.Indicator
    {...props}
    className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full data-[state=checked]:bg-primary",
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
)(({ props: { className, disabled, ...props }, cn }) => (
  <div {...props} className={cn({ disabled, className })} />
));
