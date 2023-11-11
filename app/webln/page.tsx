"use client";

import Center from "@/components/center";
import Container from "@/components/container";
import {
  WebLNContext,
  WebLNProvider,
  useWebLN,
} from "@/components/providers/webln-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import Scanner from "@/components/ui/scanner";
import { Text } from "@/components/ui/text";
import stringUtils from "@/components/ui/utils/StringUtils";
import { FormEvent, useState } from "react";
import QRCode from "react-qr-code";

function WebLNExample() {
  // Create Inovice Modal visibility
  const [cInvoiceOpen, setCInvoiceOpen] = useState(false);

  // Create Invoice Amount, Memo, Result
  const [createAmount, setCreateAmount] = useState(1);
  const [createMemo, setCreateMemo] = useState("");
  const [createdInvoice, setCreatedInvoice] = useState<null | string>(null);

  // Pay Invoice Modal visibility
  const [pInvoiceOpen, setPInvoiceOpen] = useState(false);

  // Pay Invoice Invoice, Scanning Status
  const [payInvoiceString, setPayInvoiceString] = useState("");
  const [scanning, setScanning] = useState(false);

  const webln = useWebLN();

  const { toast } = useToast();

  const submitCreateInvoice = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { paymentRequest } = await webln.makeInvoice({
        defaultAmount: createAmount,
        defaultMemo: createMemo,
      });
      setCreatedInvoice(paymentRequest);
    } catch (err) {
      console.log(err);
      toast({
        content: (err as any).message,
      });
    }
  };

  const submitPayInvoice = async (e: FormEvent) => {
    e.preventDefault();

    if (payInvoiceString) {
      try {
        await webln.sendPayment(payInvoiceString);
        setPInvoiceOpen(false);
        toast({
          content: "Payment Successful",
        });
      } catch (err) {
        console.log(err);
        toast({
          content: (err as any).message,
        });
      }
    }
  };

  const shareInvoice = async () => {
    if (createdInvoice) {
      try {
        await navigator.share({
          text: "lightning:" + createdInvoice,
        });
      } catch (err) {
        console.log(err);
        toast({
          content: (err as any).message,
        });
      }
    }
  };

  const copyInvoice = async () => {
    if (createdInvoice) {
      try {
        await navigator.clipboard.writeText("lightning:" + createdInvoice);
        toast({
          content: "Copied to clipboard",
        });
      } catch (err) {
        console.log(err);
        toast({
          content: (err as any).message,
        });
      }
    }
  };

  return (
    <div className="flex flex-col grow gap-lg items-center justify-center">
      <Text variant="h2" weight="bold" className="text-center">
        WebLN Demo
      </Text>

      <Button onClick={() => setCInvoiceOpen(true)}>Create Invoice</Button>

      <Button onClick={() => setPInvoiceOpen(true)}>Pay Invoice</Button>

      <Dialog
        open={cInvoiceOpen}
        onOpenChange={setCInvoiceOpen}
        title="Create Invoice"
        description="Create an Invoice with WebLN"
        size="md"
      >
        {createdInvoice ? (
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col w-full gap-md p-md border border-extraLightGrey rounded-[8px] shadow-sm">
              <QRCode
                value={createdInvoice}
                className="bg-white w-full h-auto"
                fgColor="rgb(var(--night))"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="flex gap-md justify-between">
                <Text>Lightning request</Text>
                <Text>
                  {stringUtils.truncateMiddleOfString(createdInvoice, 6)}
                </Text>
              </div>
            </div>

            <div className="flex justify-between gap-md">
              <Button onClick={shareInvoice}>Share</Button>
              <Button onClick={copyInvoice}>Copy</Button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-md" onSubmit={submitCreateInvoice}>
            <Input
              label="Amount (sats)"
              value={String(createAmount)}
              onChange={(e) => setCreateAmount(+e.target.value)}
              min="1"
              step="1"
              type="number"
            />

            <Input
              label="Memo (optional)"
              value={createMemo}
              onChange={(e) => setCreateMemo(e.target.value)}
            />

            <div className="flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </Dialog>

      <Dialog
        open={pInvoiceOpen}
        onOpenChange={setPInvoiceOpen}
        title="Pay Invoice"
        description="Pay an Invoice with WebLN"
        size="md"
      >
        <form className="flex flex-col gap-xl" onSubmit={submitPayInvoice}>
          <div className="flex gap-sm items-end">
            <Input
              label="Invoice"
              value={payInvoiceString}
              placeholder="lnbc..."
              onChange={(e) => setPayInvoiceString(e.target.value)}
            />

            <Button
              variant="tertiary"
              type="button"
              className="px-0 w-[44px] shrink-0"
              onClick={() => setScanning(true)}
            >
              <Icon icon="IconQrcode" size="md" />
            </Button>
          </div>

          <div className="grow flex justify-center">
            <Scanner
              scanning={scanning && pInvoiceOpen}
              onResult={(result) => {
                setPayInvoiceString(result);
                setScanning(false);
              }}
              onError={console.log}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!payInvoiceString}>
              Submit
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default function WebLN() {
  return (
    <WebLNProvider>
      <Container>
        <WebLNContext.Consumer>
          {(ctx) => (
            <>
              {ctx?.isLoading && (
                <Center>
                  <Icon className="animate-spin" icon="IconLoader2" />
                </Center>
              )}
              {ctx?.error && (
                <Center>
                  <div className="flex flex-col gap-sm">
                    <Text variant="h2" weight="bold">
                      Error
                    </Text>
                    <Text>{ctx.error.message}</Text>
                  </div>
                </Center>
              )}
              {ctx?.webln && <WebLNExample />}
            </>
          )}
        </WebLNContext.Consumer>
      </Container>
    </WebLNProvider>
  );
}
