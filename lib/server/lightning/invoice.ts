import { invoiceVerificationTimeout } from "@/lib/constants";
import prisma from "../prisma";
import { ZodObject, ZodRawShape, z } from "zod";
import { Invoice, Prisma } from "@prisma/client";
import Bolt11 from "@/lib/bolt11";

const { ALBY_ACCESS_TOKEN } = process.env;

if (!ALBY_ACCESS_TOKEN) {
  throw new Error("Missing environment variable ALBY_ACCESS_TOKEN");
}

/**
 * Lightning Invoice Utility for creating and verifying invoices.
 */
export default class InvoiceUtility<Sch extends ZodRawShape> {
  private schema: ZodObject<Sch>;

  constructor(schema: ZodObject<Sch>) {
    this.schema = schema;
  }

  /**
   * Post JSON to an Alby API endpoint with a bearer token
   */
  private async postJSON<T = Record<string, any>>(path: string, body: T) {
    try {
      return await fetch("https://api.getalby.com" + path, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ALBY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      }).then((r) => r.json());
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Get JSON from an Alby API endpoint with a bearer token
   */
  private async getJSON(path: string) {
    try {
      return await fetch("https://api.getalby.com" + path, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ALBY_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }).then((r) => r.json());
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Create a lightning invoice with the Alby API
   * @param {CreateInvoiceArgs} args - The arguments to create the invoice with
   */
  public async createInvoice(
    args: CreateInvoiceArgs,
  ): Promise<CreateInvoiceResponse> {
    const res = await this.postJSON("/invoices", args);

    if (res.error) {
      throw new Error(res.message);
    }

    return res;
  }

  /**
   * Creates an invoice following the structure of `this.schema`. The invoice will be stored in the Database for future reference.
   * @param {CreateInvoiceArgs} args - The arguments to create the invoice with
   * @param {z.infer<InvoiceUtility<Sch>["schema"]>} data - The data to register with the payment request
   */
  public async register(
    args: CreateInvoiceArgs,
    data: z.infer<InvoiceUtility<Sch>["schema"]>,
  ): Promise<CreateInvoiceResponse> {
    const parserResponse = this.schema.safeParse(data);

    if (!parserResponse.success) throw new Error(parserResponse.error.message);

    const res = await this.createInvoice(args);

    await prisma.invoice.create({
      data: {
        paymentRequest: res.payment_request,
        data: Buffer.from(JSON.stringify(data)).toString("base64"),
      },
    });

    return res;
  }

  /**
   * Decodes an invoice and verifies that its `data` field follows the structure of `this.schema`.
   * @param {string} paymentRequest - The payment request to verify
   */
  public async verify(
    paymentRequest: string,
    where: Omit<Prisma.InvoiceWhereInput, "paymentRequest"> = {},
  ): Promise<{
    invoice: Invoice;
    data: z.infer<InvoiceUtility<Sch>["schema"]>;
  }> {
    {
      const decodedInvoice = new Bolt11({ paymentRequest }).decode();

      const hash = decodedInvoice.tagsObject.payment_hash;

      if (!hash) throw new Error("Cannot find payment hash");

      const inv = await this.getJSON("/invoices/" + hash);

      if (!inv) throw new Error("Cannot find invoice");
      if (inv.state !== "SETTLED" || !inv.settled)
        throw new Error("Invoice not paid");
      if (Date.now() > new Date(inv.expires_at).getTime())
        throw new Error("Invoice expired");

      const invoice = await prisma.invoice.findFirst({
        where: {
          paymentRequest,
          ...where,
        },
      });

      if (!invoice) throw new Error("Could not find invoice");
      if (invoice.status === "PAID") throw new Error("Invoice already paid");
      if (invoice.status === "EXPIRED") throw new Error("Invoice expired");

      if (
        Date.now() - new Date(invoice.createdAt).getTime() >
        invoiceVerificationTimeout
      ) {
        await prisma.invoice.update({
          where: {
            id: invoice.id,
          },
          data: {
            status: "EXPIRED",
          },
        });
        throw new Error("Invoice timed out");
      }

      const parserResponse = this.schema.safeParse(
        JSON.parse(Buffer.from(invoice.data ?? "", "base64").toString("utf8")),
      );

      if (!parserResponse.success)
        throw new Error(parserResponse.error.message);

      return {
        invoice: await prisma.invoice.update({
          where: {
            id: invoice.id,
          },
          data: {
            status: "PAID",
          },
        }),
        data: parserResponse.data,
      };
    }
  }
}

interface CreateInvoiceArgs {
  amount: number;
  description?: string;
  description_hash?: string;
  currency?: "bc" | "btc";
  memo?: string;
  comment?: string;
  metadata?: Record<string, any>;
  payer_name?: string;
  payer_email?: string;
  payer_pubkey?: string;
}

interface CreateInvoiceResponse {
  amount: number;
  boostagram?: null | any;
  comment?: string | null;
  created_at: string;
  creation_date: number;
  currency: "bc" | "btc";
  custom_records?: Record<string, any> | null;
  description_hash?: null | string;
  expires_at: string;
  expiry: number;
  fiat_currency: "USD" | string;
  fiat_in_cents: number;
  identifier: string;
  keysend_message?: string;
  memo?: string | null;
  payer_name?: string | null;
  payer_email?: string | null;
  payer_pubkey?: string | null;
  payment_hash: string;
  payment_request: string;
  r_hash_str?: string | null;
  settled?: null | boolean;
  settled_at?: null | string | number;
  state: "CREATED" | "SETTLED" | string;
  type: "incoming" | "outgoing";
  value: number;
  metadata?: string | null;
  destination_alias?: string | null;
  destination_pubkey?: string | null;
  first_route_hint_pubkey?: string | null;
  first_route_hint_alias?: string | null;
  qr_code_png: string;
  qr_code_svg: string;
}
