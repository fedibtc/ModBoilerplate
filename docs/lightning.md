# Lightning Utilities
This template comes with some pre-made utilities for lightning invoices and secure lightning payments.

## Table of Contents
- [Bolt11 Utils](#bolt11-util)
- [Lightning Address](#lightning-address)

## Bolt11 Util
The [Bolt11](/lib/bolt11.ts) utiliity class allows you to decode a lightning invoice payment request with the [`bolt11`](https://www.npmjs.com/package/bolt11) npm package.

### Usage

```tsx
import Bolt11 from '@/lib/bolt11';

const decodedInvoice = new Bolt11({ paymentRequest: "lnbc1..." });

const decodedMutinyNetInvoice = new Bolt11({
  paymentRequest: "lntbs...",
  network: "mutinynet"
});
```

## Lightning Address
The `LnAddressUtil` utility class allows you to securely register and verify payments with additional data, useful for authentication.

Supports both mainnet and mutinynet.

### Register / Verify an invoice

```tsx
import LnAddressUtil from '@/lib/server/lightning/invoice';
import { z } from 'zod';

const schema = z.object({
  username: z.string()
})

const lnaddr = new LnAddressUtil(schema);

// Create an invoice with the data "John Doe"
const invoice = await lnaddr.register({
  amount: 100
}, {
  username: "JohnDoe"
});

// Verify that the invoice has been paid and contains data matching the zod schema.
// If the invoice has not been paid or is expired/already used, throws an error.
const { invoice, data } = await lnaddr.verify(invoice.pr);

console.log(invoice); // { id: 1, paymentRequest: "lnbc1...", status: "PAID" }

console.log(data); // { username: "JohnDoe" }
```

### Create a standalone invoice

```tsx
import LnAddressUtil from '@/lib/server/lightning/invoice';

const lnaddr = new LnAddressUtil(schema);

const invoice = await lnaddr.createInvoice({
  amount: 1000,
  description: "Please give me 1000 sats"
})
```