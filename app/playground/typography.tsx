import { Text } from "@/components/ui/text";
import Container from "./container";

export default function Typography() {
  const headings = ["display", "h1", "h2"] as const;
  const variants = ["body", "caption", "small", "tiny"] as const;
  const weights = ["normal", "medium", "bold"] as const;

  return (
    <Container title="Typography">
      <div className="flex flex-col gap-[10px]">
        {headings.map((heading) => (
          <Text key={heading} variant={heading} weight="bolder">
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
    </Container>
  );
}
