import { getBalance, requireNpub } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { lnUtil } from "./utils";

export async function POST(req: Request) {
  try {
    const npub = await requireNpub();
    const body = await req.json();

    if (!("amount" in body) || typeof body.amount !== "number") {
      throw new Error("No amount provided");
    }

    if (body.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const invoice = await lnUtil.registerInvoice(
      {
        amount: body.amount,
      },
      npub,
    );

    return Response.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const npub = await requireNpub();
    const body = await req.json();

    if (!("invoice" in body) || typeof body.invoice !== "string") {
      throw new Error("No invoice provided");
    }

    const { invoice } = await lnUtil.verifyInvoice(body.invoice, npub);

    if (!invoice.satoshis || !invoice.paymentRequest)
      throw new Error("Invalid invoice amount");

    const balance = await getBalance();

    await prisma.balance.update({
      where: {
        id: balance.id,
      },
      data: {
        balance: balance.balance + invoice.satoshis,
      },
    });

    return Response.json({
      success: true,
      data: {
        amount: invoice.satoshis,
        invoice: invoice.paymentRequest,
      },
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}