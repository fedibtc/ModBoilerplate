"use server"

import { dbClient } from "@/lib/drizzle/db"
import { User, session, user } from "@/lib/drizzle/schema"
import { formatError } from "@/lib/errors"
import { cookies } from "next/headers"
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
  const sessionCookie = cookies().get("session")

  try {
    const db = await dbClient

    const existingSession = sessionCookie?.value
      ? await db.query.session.findFirst({
          where: (s, { eq }) => eq(s.token, sessionCookie.value),
          with: {
            user: true,
          },
        })
      : null

    if (sessionCookie?.value && existingSession?.user?.pubkey === args.pubkey) {
      return { success: true, data: { user: existingSession.user } }
    } else {
      cookies().delete("session")
    }

    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.pubkey, args.pubkey),
    })

    if (existingUser) {
      if (existingSession && existingSession.userId === existingUser.id) {
        cookies().set("session", existingSession.token)

        return { success: true, data: { user: existingUser } }
      } else {
        const [newSession] = await db
          .insert(session)
          .values({ userId: existingUser.id })
          .onConflictDoUpdate({
            target: session.userId,
            set: { userId: existingUser.id },
          })
          .returning()

        cookies().set("session", newSession.token)

        return { success: true, data: { sigToken: newSession.sigToken } }
      }
    }

    const [newUser] = await db
      .insert(user)
      .values({
        pubkey: args.pubkey,
      })
      .returning()

    const [newSession] = await db
      .insert(session)
      .values({
        userId: newUser.id,
      })
      .returning()

    cookies().set("session", newSession.token)

    return { success: true, data: { sigToken: newSession.sigToken } }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
