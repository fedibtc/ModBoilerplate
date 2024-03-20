"use server";

import { formatError } from "@/lib/errors";
import { getBalance } from "@/lib/server/auth";
import { createFedimintClient } from "@/lib/server/fedimint";
import prisma from "@/lib/server/prisma";
import bolt11 from "bolt11";
import { z } from "zod";

const depositLnInput = z.object({
  invoice: z.string(),
});

export async function topup(input: z.infer<typeof depositLnInput>): Promise<
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    }
> {
  const balance = await getBalance();

  try {
    const { invoice } = depositLnInput.parse(input);

    if (!balance) {
      throw new Error("Unauthorized, please log in");
    }

    const decoded = bolt11.decode(invoice);

    const operationId: string | undefined = decoded.tags.find(
      (x) => x.tagName === "payment_hash",
    )?.data as string | undefined;

    if (!decoded.complete || !operationId || !decoded.satoshis)
      throw new Error("Invalid invoice");

    const fedimint = await createFedimintClient();

    await fedimint.ln.awaitInvoice({
      operationId,
    });

    await prisma.balance.update({
      where: {
        id: balance.balance.id,
      },
      data: {
        balance: { increment: decoded.satoshis },
      },
    });

    return { success: true };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}
