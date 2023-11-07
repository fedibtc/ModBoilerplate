import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest as Request, NextResponse as Response } from "next/server";
import createInvoice from "../lightning/createInvoice";
import decodeInvoice from "../lightning/devodeInvoice";

// export async function POST(request: Request) {
//   const body = await request.json();

//   const npub = cookies().get("npub");

//   if (!npub?.value) {
//     return Response.json({
//       success: false,
//       message: "Invalid npub",
//     });
//   }

//   const option = options[body.duration as keyof typeof options];

//   if (option) {
//     const invoice = await createInvoice({
//       amount: option.price,
//       description: JSON.stringify({
//         npub: npub.value,
//         option,
//         timeStamp: Date.now(),
//       }),
//     });

//     return Response.json({
//       success: true,
//       pr: invoice.payment_request,
//     });
//   } else {
//     return Response.json({
//       success: false,
//       message: "Invalid duration option",
//     });
//   }
// }

// export async function PUT(request: Request) {
//   const body = await request.json();

//   const npub = cookies().get("npub");

//   if (!npub?.value) {
//     return Response.json({
//       success: false,
//       message: "Invalid npub",
//     });
//   }

//   if (body?.pr && typeof body.pr === "string") {
//     try {
//       const decoded = decodeInvoice(body.pr);

//       if (decoded) {
//         const { npub: decodedNpub, option, timeStamp } = decoded;
//         if (Math.abs(Date.now() - timeStamp) >= 60000) {
//           throw new Error("Payment timed out, please try again");
//         }

//         if (npub.value !== decodedNpub) {
//           throw new Error("Invalid npub");
//         }

//         const inbox = await mailslurp.createInboxWithOptions({
//           useDomainPool: true,
//           expiresIn: option.duration,
//           inboxType: CreateInboxDtoInboxTypeEnum.HTTP_INBOX,
//           useShortAddress: true,
//         });

//         await kv.set("email-" + npub.value, inbox);

//         return Response.json({
//           success: true,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//       return Response.json({
//         success: false,
//         message: (err as any).message,
//       });
//     }
//   }
// }
