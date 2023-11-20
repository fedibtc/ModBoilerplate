import prisma from "@/lib/server/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get("id"));

  if (typeof conversationId !== "number")
    return Response.json({
      message: "Invalid conversationId",
      success: false,
    });

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      messages: true,
    },
  });

  if (!conversation)
    return Response.json({
      message: "Conversation not found",
      success: false,
    });

  return Response.json({
    success: true,
    data: conversation,
  });
}
