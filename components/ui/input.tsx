import { styled } from "@/components/ui/utils/styled";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useCallback, useState } from "react";
import { Text } from "./text";

interface CustomProps {
  value: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  width?: "auto" | "full";
  textOverflow?: "clip" | "ellipsis";
  adornment?: React.ReactNode;
}

export type InputProps = CustomProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    keyof CustomProps | "className"
  >;

/**
 * A styled <input> element
 */
export function Input({
  label,
  onFocus,
  onBlur,
  width = "full",
  adornment,
  ...inputProps
}: InputProps) {
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(true);
      if (onFocus) onFocus(ev);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (ev: React.FocusEvent<HTMLInputElement>) => {
      setHasFocus(false);
      if (onBlur) onBlur(ev);
    },
    [onBlur],
  );

  return (
    <Container width={width}>
      {label && (
        <Label>
          <Text variant="small">{label}</Text>
        </Label>
      )}
      <InputWrap isFocused={hasFocus} isDisabled={inputProps.disabled}>
        <TextInput {...inputProps} onFocus={handleFocus} onBlur={handleBlur} />
        {adornment}
      </InputWrap>
    </Container>
  );
}

const Container = styled(
  "label",
  cva("inline-flex flex flex-col text-left", {
    variants: {
      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },
  }),
);

export const Label: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div {...props} className={cn("pb-xs pl-[6px]", className)} />;

const InputWrap = styled(
  "div",
  cva(
    "inline-flex items-center h-xxl bg-white border-2 border-lightGrey rounded-lg transition-[border-color 80ms ease]",
    {
      variants: {
        isFocused: {
          true: "border-night",
        },
        isDisabled: {
          true: "bg-extraLightGrey",
        },
      },
    },
  ),
);

const TextInput = styled(
  "input",
  cva(
    "grow min-w-[60px] h-full p-md border-0 bg-transparent focus:outline-0 active:outline-0 disabled:cursor-not-allowed placeholder:text-grey",
    {
      variants: {
        textOverflow: {
          clip: "text-clip",
          ellipsis: "truncate",
        },
      },
      defaultVariants: {
        textOverflow: "clip",
      },
    },
  ),
);
