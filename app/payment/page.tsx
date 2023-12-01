"use client";

import Container from "@/components/container";
import { NostrProvider } from "@/components/providers/nostr-provider";
import {
  WebLNContext,
  WebLNProvider,
  useWebLN,
} from "@/components/providers/webln-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/hooks/use-toast";
import { Text } from "@/components/ui/text";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function PaymentDemo() {
  // The payment request generated from `createInvoice`
  const [pr, setPr] = useState("");

  const webln = useWebLN();
  const { toast } = useToast();

  // Create and register an invoice on the server to the lightning address configured in .env
  const { mutate: createInvoice, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/payment/invoice", {
        method: "POST",
      }).then((r) => r.json());

      if (res.success) {
        setPr(res.data.paymentRequest);
      } else {
        toast({
          content: "Error: " + res.message,
        });
      }
    },
  });

  // Pay the registered invoice via WebLN
  const payInvoice = async () => {
    try {
      if (!pr) {
        throw new Error("Create an invoice first");
      }

      await webln.sendPayment(pr);
    } catch (e) {
      toast({
        content: "Error: " + (e as Error).message,
      });
    }
  };

  // Check the status of the invoice, whether it is paid, pending, expired, or used
  const { mutate: checkInvoice, isPending: checkingInvoice } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/payment/invoice?paymentRequest=" + pr).then(
        (r) => r.json(),
      );

      if (res.success) {
        toast({
          content: "Payment Verified!",
        });
      } else {
        toast({
          content: "Error: " + res.message,
        });
      }
    },
  });

  return (
    <div className="flex flex-col grow gap-lg items-center justify-center">
      <Text variant="h2" weight="bold">
        Secure Lightning Payment Demo
      </Text>

      {!pr && (
        <div className="flex flex-col gap-sm w-full">
          <Text>Creates & Registers an invoice on the server</Text>
          <Button onClick={() => createInvoice()} loading={isPending}>
            Create Invoice
          </Button>
        </div>
      )}

      {pr && (
        <div className="flex flex-col gap-sm w-full">
          <Text>Pay the registered invoice via webln</Text>
          <Button onClick={payInvoice}>Pay Invoice</Button>
        </div>
      )}

      {pr && (
        <div className="flex flex-col gap-sm w-full">
          <Text>
            Checks the status of the invoice whether it&apos;s paid, pending,
            expired, or used
          </Text>
          <Button onClick={() => checkInvoice()} loading={checkingInvoice}>
            Check Invoice
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <NostrProvider>
      <WebLNProvider>
        <WebLNContext.Consumer>
          {(ctx) =>
            ctx?.webln ? (
              <Container>
                <PaymentDemo />
              </Container>
            ) : null
          }
        </WebLNContext.Consumer>
      </WebLNProvider>
    </NostrProvider>
  );
}
