import { invoiceVerificationTimeout } from "@/lib/constants";
import bolt11 from "bolt11";
import prisma from "../prisma";

const { LIGHTNING_ADDRESS, LIGHTNING_NETWORK } = process.env;

if (!LIGHTNING_ADDRESS) {
  throw new Error("Missing environment variable LIGHTNING_ADDRESS");
}

if (!["mainnet", "mutinynet"].includes(LIGHTNING_NETWORK || "")) {
  throw new Error("LIGHTNING_NETWORK must be one of 'mainnet' or 'mutinynet'");
}

export interface LnAddressUtilArgs {
  rememberInvoices?: boolean;
}

const [username, hostname] = LIGHTNING_ADDRESS.split("@");

export default class LnAddressUtil {
  public rememberInvoices: boolean;

  constructor({ rememberInvoices = false }: LnAddressUtilArgs) {
    this.rememberInvoices = rememberInvoices;
  }

  private async getJSON(path: string) {
    return await fetch(
      path.startsWith("http") ? path : `https://${hostname}${path}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    ).then((r) => r.json());
  }

  public async createInvoice(
    args: CreateInvoiceArgs,
  ): Promise<CreateInvoiceResponse> {
    const url = new URL(`https://${hostname}/lnurlp/${username}/callback`);

    url.searchParams.set("amount", (args.amount * 1000).toString());
    if (args.description) url.searchParams.set("description", args.description);

    const res = await this.getJSON(url.pathname + url.search);

    if (res.error || res.status !== "OK") {
      throw new Error(res.reason || res.message || res.status);
    }

    return res;
  }

  public decodeInvoice(bolt11_invoice: string) {
    return LIGHTNING_NETWORK === "mainnet"
      ? bolt11.decode(bolt11_invoice)
      : bolt11.decode(bolt11_invoice, {
          bech32: "tbs",
          pubKeyHash: 0x6f,
          scriptHash: 0xc4,
          validWitnessVersions: [0, 1],
        } as any);
  }

  public async registerInvoiceHash(
    args: CreateInvoiceResponse,
    userID: number,
  ) {
    const hash = this.decodeInvoice(args.pr).tagsObject.payment_hash;

    if (!hash) {
      throw new Error("Could not find payment hash");
    }

    return await prisma?.invoice.create({
      data: { paymentHash: hash, verifyUrl: args.verify, userID },
    });
  }

  public async verifyInvoiceHash(
    paymentHash: string,
    userID: number,
  ): Promise<true> {
    const invoice = await prisma?.invoice.findFirst({
      where: { paymentHash, userID },
    });

    const trackedInvoice = invoice?.timeCreated;

    if (!trackedInvoice) {
      throw new Error("Could not find invoice");
    }

    if (!invoice?.verifyUrl) {
      throw new Error("Could not find invoice verification url");
    }

    const invoicePaidRes = await this.getJSON(invoice.verifyUrl);

    if (invoicePaidRes.status !== "OK") {
      throw new Error("Invoice not found");
    }

    if (!invoicePaidRes.settled) {
      throw new Error("Invoice not paid");
    }

    if (
      Date.now() > new Date(trackedInvoice).getTime() &&
      Date.now() - new Date(trackedInvoice).getTime() <=
        invoiceVerificationTimeout
    ) {
      await prisma?.invoice.delete({
        where: { paymentHash },
      });
      return true;
    } else if (
      Date.now() - new Date(trackedInvoice).getTime() >
      invoiceVerificationTimeout
    ) {
      await prisma?.invoice.delete({
        where: { paymentHash },
      });
      throw new Error("Invoice timed out");
    }

    throw new Error("Invoice not verified");
  }

  public async registerInvoice(
    args: Omit<CreateInvoiceArgs, "description" | "memo">,
    userID: number,
  ): Promise<CreateInvoiceResponse> {
    try {
      const res = await this.createInvoice({
        ...args,
      });

      const decoded = this.decodeInvoice(res.pr);
      const hash = decoded.tagsObject.payment_hash;

      if (!hash) {
        throw new Error("Could not find payment hash");
      }

      if (this.rememberInvoices) {
        await this.registerInvoiceHash(res, userID);
      }

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async verifyInvoice(
    bolt11_invoice: string,
    userID: number,
  ): Promise<{
    invoice: ReturnType<typeof bolt11.decode>;
  }> {
    try {
      const res = this.decodeInvoice(bolt11_invoice);

      const hash = res.tagsObject.payment_hash;

      if (!hash) {
        throw new Error("Could not find payment hash");
      }

      if (this.rememberInvoices) {
        await this.verifyInvoiceHash(hash, userID);
      }

      return {
        invoice: res,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
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
