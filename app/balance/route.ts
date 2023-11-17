import prisma from "@/lib/server/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const npub = cookies().get("npub");

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No pubkey found",
    });
  }

  const data = await prisma?.balance.findFirst({
    where: {
      pubkey: npub.value,
    },
  });

  if (data) {
    return Response.json({
      success: true,
      data,
    });
  } else {
    const newBalance = await prisma?.balance.create({
      data: {
        pubkey: npub.value,
        balance: 0,
      },
    });

    return Response.json({
      success: true,
      data: newBalance,
    });
  }
}
