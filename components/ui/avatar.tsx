import Icon, { IconKey } from "@/components/ui/icon";
import stringUtils from "@/components/ui/utils/StringUtils";
import { getIdentityColors } from "@/components/ui/utils/colors";
import { styled } from "@/components/ui/utils/styled";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { z } from "zod";

export interface AvatarProps {
  id: string;
  src?: string;
  name?: string;
  icon?: IconKey;
  size?: "xs" | "sm" | "md" | "lg";
  shape?: "circle" | "square";
  holo?: boolean;
  className?: string;
}

const iconSizes = { lg: "md", md: "sm", sm: "xs", xs: "xxs" } as const;

/**
 * An Avatar component. Includes a fallback or holo background option.
 */
export const Avatar: React.FC<AvatarProps> = ({
  id,
  src,
  name,
  icon,
  size = "md",
  shape = "circle",
  holo,
  className,
  ...props
}) => {
  const [bgColor, textColor] = getIdentityColors(id);
  const [isFallback, setIsFallback] = useState(!src);

  return (
    <Root
      size={size}
      shape={shape}
      className={className}
      holo={holo}
      style={{
        backgroundColor: isFallback
          ? holo
            ? undefined
            : bgColor
          : "transparent",
      }}
      {...props}
    >
      {src && (
        <Image
          src={src}
          alt=""
          onLoadingStatusChange={(status) => setIsFallback(status === "error")}
        />
      )}
      {name && isFallback && (
        <Fallback className={holo ? "text-primary" : `text-[${textColor}`}>
          {icon ? (
            <Icon icon={icon} size={iconSizes[size]} />
          ) : (
            stringUtils.getInitialsFromName(name)
          )}
        </Fallback>
      )}
    </Root>
  );
};

const Root = styled(
  RadixAvatar.Root,
  cva(
    "relative inline-flex justify-center items-center overflow-hidden bg-[var(--bg-color)]",
    {
      variants: {
        size: {
          xs: "w-20 h-20 text-[8px]",
          sm: "w-[32px] h-[32px] text-tiny",
          md: "w-xxl h-xxl text-body",
          lg: "w-[88px] h-[88px] text-h2",
        },
        shape: {
          circle: "rounded-full",
          square: "rounded",
        },
        holo: {
          true: "bg-holo-600",
        },
      },
      compoundVariants: [
        {
          size: "sm",
          shape: "square",
          className: "rounded",
        },
        {
          size: "md",
          shape: "square",
          className: "rounded-md",
        },
        {
          size: "lg",
          shape: "square",
          className: "rounded-lg",
        },
      ],
      defaultVariants: {
        size: "md",
        shape: "circle",
      },
    },
  ),
);

const Image = styled(RadixAvatar.Image, cva("w-full h-ful object-cover"));

const Fallback = styled(
  "span",
  cva("fklex items-center justify-center pointer-events-none user-select-none"),
);
