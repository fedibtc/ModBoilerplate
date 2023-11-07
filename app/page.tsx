"use client";
import {
  WebLNContext,
  WebLNProvider,
} from "@/components/providers/webln-provider";
import { Text } from '@/components/text';

function Test() {
  const headings = ['display', 'h1', 'h2'] as const
  const variants = ['body', 'caption', 'small', 'tiny'] as const
  const weights = ['normal', 'medium', 'bold'] as const

  return <div className="flex flex-col gap-[20px] bg-holo-100">
    <Text variant="caption" weight="bolder">This is a test</Text>
    <div className="flex flex-col gap-[10px]">
      {headings.map(heading => (
        <Text key={heading} variant={heading}>
          Heading variant {heading}
        </Text>
      ))}
    </div>

    {variants.map(variant => (
      <div className="flex flex-col gap-[10px]" key={variant}>
        {weights.map(weight => (
          <Text key={weight} variant={variant} weight={weight}>
            Text variant {variant} ({weight})
          </Text>
        ))}
      </div>
    ))}
  </div>
}

export default function Index() {
  return (
    <WebLNProvider>
      <WebLNContext.Consumer>
        {(data) => data?.webln ? <Test /> : null}
      </WebLNContext.Consumer>
    </WebLNProvider>
  );
}
