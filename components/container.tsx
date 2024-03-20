import { ComponentProps } from "react";
import { styled } from "react-tailwind-variants";

export default function Container(
  props: ComponentProps<typeof ContainerInner>,
) {
  return (
    <ContainerOuter>
      <ContainerInner {...props} />
    </ContainerOuter>
  );
}

const ContainerOuter = styled("div", {
  base: "w-full flex flex-col items-center justify-center min-h-screen",
});

const ContainerInner = styled("div", {
  base: "flex flex-col gap-lg items-center justify-center grow w-full max-w-[480px]",
  variants: {
    center: {
      true: "h-full",
    },
  },
  defaultVariants: {
    center: false,
  },
});
