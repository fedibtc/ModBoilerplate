import { invoiceVerificationTimeout } from "@/lib/constants";
import prisma from "../prisma";
import { ZodObject, ZodRawShape, z } from "zod";
import { Prisma } from "@prisma/client";

const { LIGHTNING_ADDRESS, BTC_NETWORK } = process.env;

if (!LIGHTNING_ADDRESS)
  throw new Error("Missing environment variable LIGHTNING_ADDRESS");

if (BTC_NETWORK !== "mainnet" && BTC_NETWORK !== "mutinynet")
  throw new Error("LIGHTNING_NETWORK must be one of 'mainnet' or 'mutinynet'");

const [username, hostname] = LIGHTNING_ADDRESS.split("@");

export default class LnAddressUtil<Sch extends ZodRawShape> {
  private schema: ZodObject<Sch>;

  constructor(schema: ZodObject<Sch>) {
    this.schema = schema;
  }

  /**
   * Makes a GET request to the given `path` at the lightnign address hostname.
   * @param {string} path The URL pathname to make the request to
   */
  private async getJSON(path: string) {
    try {
      return await fetch(
        path.startsWith("http") ? path : `https://${hostname}${path}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      ).then((r) => r.json());
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Creates a lightning invoive with the given amount (in sats) and optionally description.
   * @param {CreateInvoiceArgs} args - The arguments to create the invoice with
   */
  public async createInvoice(
    args: CreateInvoiceArgs,
  ): Promise<CreateInvoiceResponse> {
    const url = new URL(`https://${hostname}/lnurlp/${username}/callback`);

    url.searchParams.set("amount", (args.amount * 1000).toString());
    if (args.description) url.searchParams.set("description", args.description);

    const res = await this.getJSON(url.pathname + url.search);

    if (res.error || res.status !== "OK") {
      throw new Error(res.message || res.status);
    }

    return res;
  }

  /**
   * Creates an invoice and registers it to the database.
   * @param {Omit<CreateInvoiceArgs, "description" | "memo">} args - The arguments to create the invoice with
   * @param {z.infer<typeof this.schema>} data - The data to register with the payment request
   */
  public async register(
    args: Omit<CreateInvoiceArgs, "description" | "memo">,
    data: z.infer<typeof this.schema>,
  ): Promise<CreateInvoiceResponse> {
    const res = await this.createInvoice({
      ...args,
    });

    await prisma?.invoice.create({
      data: {
        paymentRequest: res.pr,
        data: data
          ? Buffer.from(
              JSON.stringify({
                ...data,
                verifyUrl: res.verify,
              }),
            ).toString("base64")
          : undefined,
      },
    });

    return res;
  }

  /**
   * Verifies that the given payment request exists in the database and has been paid.
   * @param {string} paymentRequest - The payment request to verify
   * @param {Omit<Prisma.InvoiceWhereInput, "paymentRequest">} where - The where clause to use when searching for the invoice in the database
   */
  public async verify(
    paymentRequest: string,
    where: Omit<Prisma.InvoiceWhereInput, "paymentRequest"> = {},
  ) {
    const schemaWithVerifyUrl = this.schema.extend({
      verifyUrl: z.string().url(),
    });

    const invoice = await prisma.invoice.findFirst({
      where: { paymentRequest, ...where },
    });

    if (!invoice) throw new Error("Could not find invoice");
    if (!invoice.data) throw new Error("Could not find invoice data");
    if (invoice.status === "PAID") throw new Error("Invoice already paid");
    if (invoice.status === "EXPIRED") throw new Error("Invoice expired");

    const decodedSchema = schemaWithVerifyUrl.safeParse(
      JSON.parse(Buffer.from(invoice.data, "base64").toString()),
    );

    if (!decodedSchema.success) throw new Error(decodedSchema.error.message);

    const invoicePaidRes = await this.getJSON(decodedSchema.data.verifyUrl!);

    if (invoicePaidRes.status !== "OK") throw new Error("Invoice not found");
    if (!invoicePaidRes.settled) throw new Error("Invoice not paid");

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

    return {
      invoice: await prisma.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          status: "PAID",
        },
      }),
      data: decodedSchema.data,
    };
  }
}

interface CreateInvoiceArgs {
  amount: number;
  description?: string;
}

export interface CreateInvoiceResponse {
  status: "OK" | string;
  verify: string;
  pr: string;
}
