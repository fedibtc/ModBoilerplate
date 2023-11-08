import styled from "./styled";
import { cva } from "class-variance-authority";

const Container = styled<HTMLLabelElement>(cva(
  "inline-flex flex flex-col text-left",
  {
    variants: {
      width: {
        auto: "w-auto",
        full: "w-full"
      }
    }
  }
))(
  // @ts-expect-error here we go again
  ({ width, className, ...props }, ref, cn) => <label className={cn({ width, className })} ref={ref} {...props} />
)

const Label = styled(cva(
  "pb-[4px] pl-[6px]",
))(
  ({ className, ...props }, ref, cn) => <div {...props} className={cn({ className })} ref={ref}/>
)

const InputWrap = styled(cva(
  "inline-flex items-center h-[48px] bg-white border-2 border-lightGrey rounded-lg transition-[border-color 80ms ease]",
  {
    variants: {
      isFocused: {
        true: "border-night"
      },
      isDisabled: {
        true: "bg-extraLightGrey"
      }
    }
  }
))(
  ({ className, isFocused, isDisabled, ...props }, ref, cn) => <div {...props} ref={ref} className={cn({ isFocused, isDisabled, className })}/> 
)

const TextInput = styled<HTMLInputElement>(cva(
  "grow min-w-[60px] h-full p-[12px] border-0 bg-transparent focus:outline-0 active:outline-0 disabled:cursor-not-allowed placeholder:text-grey",
  {
    variants: {
      textOverflow: {
        clip: "text-clip",
        ellipsis: "truncate"
      }
    },
    defaultVariants: {
      textOverflow: "clip"
    }
  }
))(
  // @ts-expect-error Input issues idk
  ({ textOverflow, className, ...props }, ref, cn) => <input {...props} ref={ref} className={cn({ textOverflow, className })}/>
)