"use client";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { useState } from "react";

function Texts() {
  const headings = ["display", "h1", "h2"] as const;
  const variants = ["body", "caption", "small", "tiny"] as const;
  const weights = ["normal", "medium", "bold"] as const;

  return (
    <div className="flex flex-col gap-[20px] bg-holo-100">
      <div className="flex flex-col gap-[10px]">
        {headings.map((heading) => (
          <Text key={heading} variant={heading}>
            Heading variant {heading}
          </Text>
        ))}
      </div>

      {variants.map((variant) => (
        <div className="flex flex-col gap-[10px]" key={variant}>
          {weights.map((weight) => (
            <Text key={weight} variant={variant} weight={weight}>
              Text variant {variant} ({weight})
            </Text>
          ))}
        </div>
      ))}

      <div className=""></div>
    </div>
  );
}

function Buttons() {
  const sizes = ["md", "sm"] as const;
  const variants = ["primary", "secondary", "tertiary", "outline"] as const;
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const toggleLoading = () => {
    setIsLoading((is) => !is);
  };

  const toggleDisabled = () => {
    setIsDisabled((is) => !is);
  };

  return (
    <div className="flex flex-col gap-[20px] bg-holo-100">
      <div className="flex items-center gap-[20px]">
        <button onClick={toggleLoading}>
          Toggle loading ({isLoading ? "true" : "false"})
        </button>
        <button onClick={toggleDisabled}>Toggle disabled</button>
      </div>

      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center gap-[20px]"></div>
      </div>

      {sizes.map((size) => (
        <div className="flex flex-col gap-[20px]" key={size}>
          {variants.map((variant) => (
            <div className="flex items-center gap-[20px]" key={variant}>
              <Button
                size={size}
                variant={variant}
                loading={isLoading}
                disabled={isDisabled}
              >
                Button {size} {variant}
              </Button>
              <Button
                size={size}
                variant={variant}
                icon={"IconSettings"}
                loading={isLoading}
                disabled={isDisabled}
              >
                Button {size} {variant}
              </Button>
              <Button
                size={size}
                variant={variant}
                href="/playground"
                loading={isLoading}
                disabled={isDisabled}
              >
                Button link
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  return (
    <div className="flex flex-col divide-y divide-grey p-8">
      <Texts />
      <Buttons />
    </div>
  );
}
