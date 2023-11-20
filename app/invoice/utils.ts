import InvoiceUtility from "@/lib/server/lightning/invoice";
import { z } from "zod";

export const schema = z.object({
  amount: z.number().positive(),
  npub: z.string(),
});

export const invoiceUtil = new InvoiceUtility({
  schema,
  rememberInvoices: true,
});
