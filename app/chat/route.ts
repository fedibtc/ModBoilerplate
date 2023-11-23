import { minSats } from "@/lib/constants";
import { satsForTokens, tokensForSats } from "@/lib/sats";
import { getBalance, requireNpub } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { openai } from "../api/chat/openai";

export async function POST(req: Request) {
  try {
    const npub = await requireNpub();
    const body = await req.json();

    if (!("text" in body) || typeof body.text !== "string") {
      throw new Error("No text provided");
    }

    const balance = await getBalance();

    if (balance.balance < minSats) {
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

    const convo = await prisma.conversation.create({
      data: {
        pubkey: npub,
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
      max_tokens: tokensForSats(balance.balance),
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
        balance:
          balance.balance -
          satsForTokens(initialResponse.usage?.completion_tokens ?? 1),
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

    return Response.json({
      success: true,
      data: convo,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}

export async function GET() {
  try {
    const npub = await requireNpub();

    const conversations = await prisma.conversation.findMany({
      where: {
        pubkey: npub,
      },
    });

    return Response.json({
      success: true,
      data: conversations,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const npub = await requireNpub();
    const body = await req.json();

    if (
      !("conversationId" in body) ||
      typeof body.conversationId !== "number"
    ) {
      throw new Error("No conversationId provided");
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: body.conversationId,
        pubkey: npub,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await prisma.message.deleteMany({
      where: {
        conversationID: body.conversationId,
      },
    });

    await prisma.conversation.delete({
      where: {
        id: body.conversationId,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}