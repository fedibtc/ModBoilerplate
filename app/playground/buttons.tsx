import { Button } from "@/components/ui/button";
import { useState } from "react";
import Container from "./container";

export default function Buttons() {
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
    <Container title="Button">
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
            <div
              className="flex items-center gap-[20px] flex-wrap w-full"
              key={variant}
            >
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
    </Container>
  );
}
