"use server"

import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { User } from "@prisma/client"
import { cookies } from "next/headers"
import { Event, verifyEvent } from "nostr-tools"
import { z } from "zod"

const connectInput = z
  .object({
    pubkey: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!/^[a-f0-9]{64}$/i.test(data.pubkey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid pubkey format",
        path: ["pubkey"],
      })
    }
  })

type ConnectInput = z.infer<typeof connectInput>

type ConnectResult =
  | {
      success: true
      data: {
        user: User
      }
    }
  | {
      success: true
      data: {
        sigToken: string
      }
    }
  | {
      success: false
      message: string
    }

export async function connect(args: ConnectInput): Promise<ConnectResult> {
  try {
    const sessionCookie = cookies().get("session")

    const session = await prisma.session.findFirst({
      where: {
        token: sessionCookie?.value,
      },
      include: {
        user: true,
      },
    })

    if (sessionCookie?.value && session?.user?.pubkey === args.pubkey) {
      return { success: true, data: { user: session.user } }
    } else {
      cookies().delete("session")
    }

    const user = await prisma.user.findFirst({
      where: {
        pubkey: args.pubkey,
      },
    })

    if (user) {
      if (session && session.userId === user.id) {
        cookies().set("session", session.token)

        return { success: true, data: { user } }
      } else {
        const newSession = await prisma.session.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
          },
          update: {},
        })

        cookies().set("session", newSession.token)

        return { success: true, data: { sigToken: newSession.sigToken } }
      }
    }

    const newUser = await prisma.user.create({
      data: {
        pubkey: args.pubkey,
        session: {
          create: {},
        },
      },
      include: {
        session: true,
      },
    })

    if (!newUser.session) throw new Error("Error creating session")

    cookies().set("session", newUser.session.token)

    return { success: true, data: { sigToken: newUser.session.sigToken } }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function login(evt: Event) {
  try {
    const isValid = verifyEvent(evt)

    if (!isValid) throw new Error("Invalid event")

    const user = await prisma.user.findFirst({
      where: {
        pubkey: evt.pubkey,
      },
    })

    if (!user) throw new Error("No user found")

    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (!session) throw new Error("No session found")

    const challengeTag = evt.tags.find(tag => tag[0] === "challenge")

    if (!challengeTag) throw new Error("No challenge tag found")

    if (session.sigToken !== challengeTag[1])
      throw new Error("Invalid signature")

    cookies().set("token", session.token)

    return {
      success: true,
      data: {
        user,
      },
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    }
  }
}
