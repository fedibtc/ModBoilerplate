"use server";

import { formatError } from "@/lib/errors";
import { getSession } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { z } from "zod";

const deleteChatSchema = z.object({
  conversationId: z.number(),
});

export async function deleteChat(
  input: z.infer<typeof deleteChatSchema>,
): Promise<{ success: true } | { success: false; message: string }> {
  const session = await getSession();

  try {
    if (!session) {
      throw new Error("Unauthorized, please log in");
    }

    const { conversationId } = deleteChatSchema.parse(input);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userID: session.userID,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await prisma.message.deleteMany({
      where: {
        conversationID: conversationId,
      },
    });

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}
