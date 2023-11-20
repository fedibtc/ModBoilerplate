import prisma from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { invoiceUtil } from "./utils";

export async function POST(req: Request) {
  const npub = cookies().get("npub");
  const body = await req.json();

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No npub provided",
    });
  }

  if (!("amount" in body) || typeof body.amount !== "number") {
    return Response.json({
      success: false,
      message: "No amount provided",
    });
  }

  if (body.amount < 0) {
    return Response.json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  const invoice = await invoiceUtil.registerInvoiceWithSchema(
    {
      amount: body.amount,
    },
    {
      amount: body.amount,
      npub: npub?.value,
    },
  );

  return Response.json({
    success: true,
    data: invoice,
  });
}

export async function PUT(req: Request) {
  const npub = cookies().get("npub");
  const body = await req.json();

  if (!npub?.value) {
    return Response.json({
      success: false,
      message: "No npub provided",
    });
  }

  if (!("invoice" in body) || typeof body.invoice !== "string") {
    return Response.json({
      success: false,
      message: "No invoice provided",
    });
  }

  const { data } = await invoiceUtil.verifyInvoiceWithSchema(body.invoice);

  if (data.npub !== npub?.value) {
    return Response.json({
      success: false,
      message: "Npub does not match",
    });
  }

  const balance = await prisma.balance.findFirst({
    where: {
      pubkey: npub.value,
    },
  });

  if (!balance) {
    return Response.json({
      success: false,
      message: "Could not find balance",
    });
  }

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
}
