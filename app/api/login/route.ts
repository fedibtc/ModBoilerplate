import { Event, verifyEvent } from "nostr-tools";
import prisma from "@/lib/server/prisma";
import { v4 } from "uuid";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pk = searchParams.get("pk");

    if (!pk) throw new Error("Public key not provided");
    if (!/^[a-f0-9]{64}$/i.test(pk)) throw new Error("Invalid public key");

    const token = cookies().get("token");

    const activeUserSession = await prisma.session.findFirst({
      where: {
        token: token?.value,
      },
      include: {
        user: true,
      },
    });

    if (
      activeUserSession &&
      token?.value &&
      activeUserSession.user.pubkey === pk
    ) {
      return Response.json({
        success: true,
        data: {
          user: activeUserSession.user,
        },
      });
    } else {
      cookies().delete("token");
    }

    let sigToken: string;

    const user = await prisma.user.findFirst({
      where: {
        pubkey: pk,
      },
      include: {
        session: true,
      },
    });

    if (user && user.session) {
      sigToken = user.session.sigToken;
    } else if (user && !user.session) {
      const session = await prisma.session.create({
        data: {
          sigToken: v4(),
          token: v4(),
          userID: user.id,
        },
      });

      sigToken = session.sigToken;
    } else {
      const newUser = await prisma.user.create({
        data: {
          pubkey: pk,
        },
      });

      const session = await prisma.session.create({
        data: {
          sigToken: v4(),
          token: v4(),
          userID: newUser.id,
        },
      });

      sigToken = session.sigToken;
    }

    return Response.json({
      data: {
        refreshToken: sigToken,
      },
      success: true,
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}

export async function POST(req: Request) {
  try {
    const evt: Event = await req.json();

    const isValid = verifyEvent(evt);

    if (!isValid) throw new Error("Invalid event");

    const user = await prisma.user.findFirst({
      where: {
        pubkey: evt.pubkey,
      },
    });

    if (!user) throw new Error("No user found");

    const session = await prisma.session.findFirst({
      where: {
        userID: user.id,
      },
    });

    if (!session) throw new Error("No session found");

    if (session.sigToken !== evt.content.split(": ")[1])
      throw new Error("Invalid signature");

    cookies().set("token", session.token);

    return Response.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}
