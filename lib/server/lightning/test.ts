import InvoiceUtility from "./invoice";
import LnAddressUtil from "./address";
import { z } from "zod";

const schema = z.object({
  test: z.string(),
});

const inv = new InvoiceUtility(schema);
const addr = new LnAddressUtil(schema);

// console.log(await inv.register({
//   amount: 100
// }, {
//   test: "asdf"
// }))

// console.log(
//   await inv.verify(
//     "lnbc1u1pj4u7nwpp5qrlf64kwxsgykptyz3krd55788kwn5f9csskltq4nkmkyhfqqvcsdp8g9ck24phv3cxk3232a24z525f3jkwun2gg64gdccqzzsxqyz5vqsp5tu4g6pwadxhsf8f27em5tyya4ejy07g7lfzyhfp4ekw4knu48ghs9qyyssqfg3e9a0uyrqwe82nxvf60z7rqufmmlmxmuzajggwc5c379n4695pu2vk59svheflutngnjp8sfl4k4p94shtsaa3f5xm7jxtmv8xhqspvqqk0t"
//   )
// );

// console.log(await addr.register({
//   amount: 100
// }, {
//   test: "asdf"
// }))

console.log(
  await addr.verify(
    "lnbc1u1pj4u7cepp5qmhct4qqtjrmsrgh449eax0jyuswqc39nj6qcghfczxgta9rdxashp5mpvs49vfh30cjy56zyv9nx8k6h2chrwyk07rnf698qsd732rgfsqcqzzsxqyz5vqsp5mvz35ms9mmp9vdwa48kh2r3dcyly5vxmfd9409scghe8nxpqxmms9qyyssqnmac5tyxvyzun0a8kajgps0qxs3alj5wkjzv6n8guvw3jawnevpyz0yazu4xnvhy9lyavlm4jx4kyqhx40d0z04s22zz0x3fef8msrspf4cafh",
  ),
);
