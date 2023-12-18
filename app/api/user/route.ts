import prisma from "@/lib/server/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.npub || typeof body.npub !== "string")
      throw new Error("Invalid Npub");

    const user = await prisma.user.findFirst({
      where: {
        npub: body.npub,
      },
    });

    if (user) {
      const sk = cookies().get("sk");

      if (sk?.value === user.privateKey) {
        return Response.json({
          success: true,
          exists: true,
          user,
        });
      }
    }

    return Response.json({
      success: true,
      exists: !!user,
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}
