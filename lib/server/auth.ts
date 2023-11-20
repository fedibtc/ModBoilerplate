import { Balance } from "@prisma/client";
import { cookies } from "next/headers";

export function requireNpub() {
  const npub = cookies().get("npub");

  if (!npub?.value) {
    throw new Error("No npub provided");
  }

  return npub!.value;
}

export async function getBalance(npub: string): Promise<Balance> {
  const data = await prisma?.balance.findFirst({
    where: {
      pubkey: npub,
    },
  });

  if (!data) {
    const newBalance = await prisma?.balance.create({
      data: {
        pubkey: npub,
        balance: 0,
      },
    });

    if (newBalance) return newBalance;
    else throw new Error("Could not create balance");
  }

  return data;
}
