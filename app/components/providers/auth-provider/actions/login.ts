"use server"

import { dbClient } from "@/lib/drizzle/db"
import { User } from "@/lib/drizzle/schema"
import { formatError } from "@/lib/errors"
import { cookies } from "next/headers"
import { Event, verifyEvent } from "nostr-tools"

export async function login(
  evt: Event,
): Promise<
  { success: true; data: { user: User } } | { success: false; message: string }
> {
  try {
    const db = await dbClient

    const isValid = verifyEvent(evt)

    if (!isValid) throw new Error("Invalid event")

    const user = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.pubkey, evt.pubkey),
    })

    if (!user) throw new Error("No user found")

    const session = await db.query.session.findFirst({
      where: (u, { eq }) => eq(u.userId, user.id),
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
