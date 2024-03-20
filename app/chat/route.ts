import { getSession } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";

export async function GET() {
  const session = await getSession();
  try {
    if (!session) {
      throw new Error("Unauthorized, please log in");
    }
    const conversations = await prisma.conversation.findMany({
      where: {
        userID: session.user.id,
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
