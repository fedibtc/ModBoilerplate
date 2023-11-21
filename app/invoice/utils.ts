import LnAddressUtil from "@/lib/server/lightning/address";

export const lnUtil = new LnAddressUtil({
  rememberInvoices: true,
});
