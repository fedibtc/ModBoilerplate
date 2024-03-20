"use server";

import { openai } from "@/app/api/chat/openai";
import { formatError } from "@/lib/errors";
import { satsForTokens, tokensForSats } from "@/lib/sats";
import { getBalance } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { Conversation } from "@prisma/client";
import { z } from "zod";

const createChatSchema = z.object({
  text: z.string(),
});

export async function createChat(
  input: z.infer<typeof createChatSchema>,
): Promise<
  { success: true; data: Conversation } | { success: false; message: string }
> {
  const bal = await getBalance();

  try {
    const body = createChatSchema.parse(input);

    if (!bal) {
      throw new Error("No balance found");
    }

    const { balance, user } = bal;

    if (balance.balance < 1) {
      throw new Error("Insufficient balance");
    }

    const titleResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "Create a very short title/summary for this conversation in as little words as possible:",
        },
        {
          role: "user",
          content: body.text,
        },
      ],
      max_tokens: 10,
    });

    const title = titleResponse.choices[0].message.content;

    if (!title) {
      throw new Error("Failed to generate a title");
    }

    const completionTokens = tokensForSats(balance.balance) - body.text.length;

    if (completionTokens <= 0) {
      throw new Error("Insufficient balance");
    }

    const convo = await prisma.conversation.create({
      data: {
        userID: user.id,
        title,
      },
    });

    const initialResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "user",
          content: body.text,
        },
      ],
      max_tokens: completionTokens,
    });

    const initialResponseText = initialResponse.choices[0].message.content;

    if (!initialResponseText) {
      throw new Error("Failed to generate initial response");
    }

    await prisma.balance.update({
      where: {
        id: balance.id,
      },
      data: {
        balance: Math.max(
          balance.balance -
            satsForTokens(initialResponse.usage?.completion_tokens ?? 1),
          0,
        ),
      },
    });

    await prisma.message.createMany({
      data: [
        {
          content: body.text,
          conversationID: convo.id,
          role: "USER",
        },
        {
          content: initialResponseText,
          conversationID: convo.id,
          role: "SYSTEM",
        },
      ],
    });

    return {
      success: true,
      data: convo,
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}
