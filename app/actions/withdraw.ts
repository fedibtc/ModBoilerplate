"use server";

import { formatError } from "@/lib/errors";
import { getBalance } from "@/lib/server/auth";
import { createFedimintClient } from "@/lib/server/fedimint";
import prisma from "@/lib/server/prisma";
import bolt11 from "bolt11";
import { z } from "zod";

const redeemLightningInput = z.object({
  invoice: z.string(),
});

type RedeemLightningInput = z.infer<typeof redeemLightningInput>;

type RedeemLightingResult =
  | {
      success: true;
      amount: number;
    }
  | {
      success: false;
      message: string;
    };

export async function redeemLighting(
  input: RedeemLightningInput,
): Promise<RedeemLightingResult> {
  const balance = await getBalance();

  try {
    const { invoice } = redeemLightningInput.parse(input);

    if (!balance) throw new Error("No balance found");

    const decoded = bolt11.decode(invoice);

    if (!decoded.complete || !decoded.satoshis)
      throw new Error("Invalid invoice");

    const amount = decoded.satoshis;

    if (amount > balance.balance.balance)
      throw new Error("Insufficient balance");

    const fedimint = await createFedimintClient();

    await fedimint.lightning.pay({
      paymentInfo: invoice,
    });

    await prisma.balance.update({
      where: {
        id: balance.balance.id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    return {
      success: true,
      amount,
    };
  } catch (e) {
    return {
      success: false,
      message: formatError(e),
    };
  }
}
