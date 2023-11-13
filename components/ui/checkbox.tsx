import Icon from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Infer, styled } from "@/components/ui/utils/styled";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as RadixLabel from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { z } from "zod";

export interface CheckboxProps {
  checked: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  labelTextProps?: Infer<typeof Text>;
  onChange?: (checked: boolean) => void;
}

/**
 * An individual Checkbox component.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  labelTextProps,
  ...props
}) => {
  return (
    <Root disabled={props.disabled}>
      <CheckboxRoot {...props} onCheckedChange={onChange}>
        <CheckboxIndicator>
          <Icon size="xs" icon="IconCheck" />
        </CheckboxIndicator>
      </CheckboxRoot>
      {label && (
        <Label disabled={props.disabled}>
          <Text variant="caption" weight="medium" {...labelTextProps}>
            {label}
          </Text>
        </Label>
      )}
    </Root>
  );
};

const Root = styled(
  "label",
  cva("flex items-center gap-10 cursor-pointer", {
    variants: {
      disabled: {
        true: "cursor-not-allowed",
      },
    },
  }),
)(({ props: { className, ...props }, cn }) => (
  <RadixLabel.Label {...props} className={cn({ className })} />
));

export const CheckboxRoot = styled(
  "button",
  cva(
    "relative inline-flex justify-center items-center shrink-0 w-[22px] h-[22px] p-0 bg-white border-solid border-2 border-primary rounded cursor-pointer data-[state=checked]:bg-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed",
  ),
  z.object({
    checked: z
      .boolean()
      .or(z.enum(["indeterminate"]))
      .optional(),
    defaultChecked: z
      .boolean()
      .or(z.enum(["indeterminate"]))
      .optional(),
    required: z.boolean().optional(),
    onCheckedChange: z.function(z.tuple([z.boolean()]), z.void()).optional(),
  }),
)(({ props: { className, ...props }, cn }) => (
  <RadixCheckbox.Root {...props} className={cn({ className })} />
));

const CheckboxIndicator = styled(
  "span",
  cva(
    "block w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 data-[state=checked]:opacity-100",
  ),
)(({ props: { className, ...props }, cn }) => (
  <RadixCheckbox.Indicator {...props} className={cn({ className })} />
));

const Label = styled(
  "div",
  cva("grow", {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  }),
)(({ props: { className, disabled, ...props }, cn }) => (
  <div {...props} className={cn({ disabled, className })} />
));
