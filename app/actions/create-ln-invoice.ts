"use server";

import { formatError } from "@/lib/errors";
import { getSession } from "@/lib/server/auth";
import { createFedimintClient } from "@/lib/server/fedimint";
import { z } from "zod";

const createLnInvoiceInput = z.object({
  amount: z.number().gt(0).int(),
});

type CreateLnInvoiceInput = z.infer<typeof createLnInvoiceInput>;

type CreateLnInvoiceResult =
  | {
      success: true;
      data: {
        invoice: string;
        operationId: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export async function createLnInvoice(
  input: CreateLnInvoiceInput,
): Promise<CreateLnInvoiceResult> {
  const session = await getSession();

  try {
    const { amount } = createLnInvoiceInput.parse(input);

    if (!session) {
      throw new Error("Unauthorized, please log in");
    }

    const amountMsat = amount * 1000;

    const fedimint = await createFedimintClient();

    const { invoice, operationId } = await fedimint.lightning.createInvoice({
      amountMsat,
      description: `Deposit ${amount} sats`,
    });

    return {
      success: true,
      data: {
        invoice,
        operationId,
      },
    };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}
