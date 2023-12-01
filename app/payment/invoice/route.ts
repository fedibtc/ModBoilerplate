import LnAddressUtil from "@/lib/server/lightning/address";
import { cookies } from "next/headers";
import { z } from "zod";

// The user's Nostr Pubkey is what's used to identify and verify the user's invoices
const sch = z.object({
  npub: z.string(),
});

const inv = new LnAddressUtil(sch);

export async function POST() {
  try {
    const npub = cookies().get("npub");

    if (!npub?.value || typeof npub.value !== "string") {
      throw new Error("Npub required");
    }

    // Register an invoice for one satoshi with data containing the user's npub
    const invoice = await inv.register(
      {
        amount: 1,
      },
      {
        npub: npub.value,
      },
    );

    return Response.json({
      success: true,
      message: "Invoice created",
      data: {
        paymentRequest: invoice.pr,
      },
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const paymentRequest = url.searchParams.get("paymentRequest");

  try {
    if (!paymentRequest || typeof paymentRequest !== "string") {
      throw new Error("Invalid Payment Request");
    }

    // Verify the invoice by payment request. Throws an error in cases of failure.
    await inv.verify(paymentRequest);

    return Response.json({
      success: true,
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}
