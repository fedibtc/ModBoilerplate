import { ComponentProps } from "react"
import { styled } from "react-tailwind-variants"
import Flex from "./flex"

export default function Container(
  props: ComponentProps<typeof ContainerInner>,
) {
  return (
    <Flex col center width="full" className="min-h-screen">
      <ContainerInner {...props} />
    </Flex>
  )
}

const ContainerInner = styled("div", {
  base: "flex flex-col gap-4 items-center justify-center grow w-full max-w-[480px]",
})
