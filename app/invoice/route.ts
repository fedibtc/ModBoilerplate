import { getBalance, requireNpub } from "@/lib/server/auth";
import prisma from "@/lib/server/prisma";
import { invoiceUtil } from "./utils";

export async function POST(req: Request) {
  try {
    const npub = await requireNpub();
    const body = await req.json();

    if (!("amount" in body) || typeof body.amount !== "number") {
      throw new Error("No amount provided");
    }

    if (body.amount < 0) {
      throw new Error("Amount must be greater than 0");
    }

    const invoice = await invoiceUtil.registerInvoiceWithSchema(
      {
        amount: body.amount,
      },
      {
        amount: body.amount,
        npub: npub,
      },
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

    const { data } = await invoiceUtil.verifyInvoiceWithSchema(body.invoice);

    if (data.npub !== npub) {
      throw new Error("Invoice does not belong to you");
    }

    const balance = await getBalance();

    await prisma.balance.update({
      where: {
        id: balance.id,
      },
      data: {
        balance: balance.balance + data.amount,
      },
    });

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}
