"use server";

import { formatError } from "@/lib/errors";
import { getBalance, getSession } from "@/lib/server/auth";
import { createFedimintClient } from "@/lib/server/fedimint";
import prisma from "@/lib/server/prisma";
import { z } from "zod";

const depositEcashInput = z.object({
  notes: z.string(),
});

type DepositEcashResult =
  | {
      success: true;
      amount: number;
    }
  | {
      success: false;
      message: string;
    };

export async function depositEcash(
  input: z.infer<typeof depositEcashInput>,
): Promise<DepositEcashResult> {
  const session = await getSession();
  const balance = await getBalance();

  try {
    const { notes } = depositEcashInput.parse(input);

    if (!session || !balance) {
      throw new Error("Unauthorized, please log in");
    }

    const fedimint = await createFedimintClient();

    const { amountMsat } = await fedimint.mint.reissue(notes);

    const amount = Math.round(amountMsat / 1000);

    await prisma.balance.update({
      where: {
        id: balance.balance.id,
      },
      data: {
        balance: { increment: amount },
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
