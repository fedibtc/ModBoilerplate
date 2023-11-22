import bolt11, { PaymentRequestObject, TagsObject } from "bolt11";

export default class Bolt11 {
  public paymentRequest: string;
  public network: "mainnet" | "mutinynet";
  public error?: string;

  constructor({
    paymentRequest,
    network = (process.env.BTC_NETWORK as BtcNetwork | undefined) ?? "mainnet",
  }: Bolt11Args) {
    this.paymentRequest = paymentRequest;
    this.network = network;
  }

  /**
   * Decodes a bolt11 invoice payment request and returns the decoded data.
   */
  public decode(): Bolt11DecodeResult {
    return bolt11.decode(
      this.paymentRequest,
      this.network === "mutinynet"
        ? {
            bech32: "tbs",
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            validWitnessVersions: [0, 1],
          }
        : undefined,
    );
  }
}

export type Bolt11DecodeResult = PaymentRequestObject & {
  tagsObject: TagsObject;
};

type BtcNetwork = "mainnet" | "mutinynet";

interface Bolt11Args {
  /**
   * A bolt11 payment request
   */
  paymentRequest: string;
  /**
   * Which network to use. Supports mainnet and mutinynet. Defaults to mainnet if not specified.
   */
  network?: BtcNetwork;
}
