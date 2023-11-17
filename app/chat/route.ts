import prisma from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { openai } from "../api/chat/openai";

export async function POST(req: Request) {
  const npub = cookies().get("npub");
  const body = await req.json();

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No npub provided",
    });
  }

  if (!("text" in body) || typeof body.text !== "string") {
    return Response.json({
      success: false,
      message: "No text provided",
    });
  }

  const titleResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are a text model designed to create a short and concise summary of a conversation based on the first message the user sends. One sentence. No punctuation. Very short and concise summary.",
      },
      {
        role: "user",
        content: body.text,
      },
    ],
  });

  const title = titleResponse.choices[0].message.content;

  if (!title) {
    return Response.json({
      success: false,
      message: "Failed to generate a title",
    });
  }

  const convo = await prisma.conversation.create({
    data: {
      pubkey: npub.value,
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
  });

  const initialResponseText = initialResponse.choices[0].message.content;

  if (!initialResponseText) {
    return Response.json({
      success: false,
      message: "Failed to generate initial response",
    });
  }

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

  const conversationWithMessages = await prisma.conversation.findFirst({
    where: {
      id: convo.id,
    },
    include: {
      messages: true,
    },
  });

  return Response.json({
    success: true,
    data: conversationWithMessages,
  });
}

export async function GET(req: Request) {
  const npub = cookies().get("npub");

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No npub provided",
    });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      pubkey: npub?.value,
    },
  });

  return Response.json({
    success: true,
    data: conversations,
  });
}

export async function DELETE(req: Request) {
  const npub = cookies().get("npub");
  const body = await req.json();

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No npub provided",
    });
  }

  if (!("conversationID" in body) || typeof body.conversationID !== "string") {
    return Response.json({
      success: false,
      message: "No conversationID provided",
    });
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: body.conversationID,
      pubkey: npub.value,
    },
  });

  if (!conversation) {
    return Response.json({
      success: false,
      message: "Conversation not found",
    });
  }

  await prisma.message.deleteMany({
    where: {
      conversationID: body.conversationID,
    },
  });

  await prisma.conversation.delete({
    where: {
      id: body.conversationID,
    },
  });

  return Response.json({
    success: true,
  });
}
