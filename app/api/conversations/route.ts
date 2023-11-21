import { requireNpub } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";

export async function GET(req: Request) {
  const npub = await requireNpub();
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get("id"));

  if (typeof conversationId !== "number") throw new Error("Invalid ID");

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      pubkey: npub,
    },
    include: {
      messages: true,
    },
  });

  if (!conversation) throw new Error("Conversation not found");

  return Response.json({
    success: true,
    data: conversation,
  });
}
