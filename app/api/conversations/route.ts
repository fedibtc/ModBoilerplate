import { getBalance } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";

export async function GET(req: Request) {
  const balance = await getBalance();
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get("id"));

  if (typeof conversationId !== "number") throw new Error("Invalid ID");

  const conversation =
    typeof balance?.balance.userID === "number"
      ? await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            userID: balance.balance.userID,
          },
          include: {
            messages: true,
          },
        })
      : null;

  if (!conversation) throw new Error("Conversation not found");

  return Response.json({
    success: true,
    data: conversation,
  });
}
