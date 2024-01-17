import { minSats } from "@/lib/constants";
import { satsForTokens, tokensForSats } from "@/lib/sats";
import { getBalance } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai } from "./openai";

export async function POST(req: Request) {
  try {
    const { balance } = await getBalance();
    const { messages, conversationId } = await req.json();

    if (typeof conversationId !== "number") {
      throw new Error("Invalid Conversation ID");
    }

    if (!Array.isArray(messages)) {
      throw new Error("Messages must be an array");
    }

    if (messages.length < 1) {
      throw new Error("No messages provided");
    }

    if (balance.balance < minSats) {
      throw new Error("Insufficient balance");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages,
      max_tokens: Math.min(tokensForSats(balance.balance), 16386),
    });

    const last = messages.at(-1);

    let tokens = 0;

    const stream = OpenAIStream(response, {
      async onFinal(completion) {
        await prisma.message.createMany({
          data: [
            {
              content: last.content,
              role: "USER",
              conversationID: conversationId,
            },
            {
              content: completion,
              role: "SYSTEM",
              conversationID: conversationId,
            },
          ],
        });

        await prisma.balance.update({
          where: {
            id: balance.id,
          },
          data: {
            balance: balance.balance - satsForTokens(tokens),
          },
        });
      },
      onToken: () => {
        tokens++;
      },
    });

    return new StreamingTextResponse(stream);
  } catch (err) {
    return new Response((err as Error).message);
  }
}
