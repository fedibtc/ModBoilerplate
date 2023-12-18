import prisma from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { generatePrivateKey, getPublicKey } from "nostr-tools";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sk = cookies().get("sk");

    console.log(sk);

    if (sk) {
      const user = await prisma.user.findFirst({
        where: {
          privateKey: sk.value,
        },
      });

      if (user) {
        return Response.json({
          success: true,
          data: { user },
        });
      }
    }

    if (!body.npub || typeof body.npub !== "string")
      throw new Error("Invalid Npub");
    if (!body.pin || typeof body.npub !== "string")
      throw new Error("Invalid Pin");

    const user = await prisma.user.findFirst({
      where: {
        npub: body.npub,
      },
    });

    if (!user) {
      const privateKey = generatePrivateKey();

      const newUser = await prisma.user.create({
        data: {
          npub: body.npub,
          pin: body.pin,
          privateKey,
          publicKey: getPublicKey(privateKey),
        },
      });

      cookies().set("sk", privateKey);

      return Response.json({
        success: true,
        data: { user: newUser },
      });
    } else {
      if (user.pin !== body.pin) {
        throw new Error("Incorrect pin");
      } else {
        cookies().set("sk", user.privateKey);

        return Response.json({
          success: true,
          data: { user },
        });
      }
    }
  } catch (e) {
    return Response.json({
      success: false,
      error: (e as Error).message,
    });
  }
}
