import { getBalance } from "@/lib/server/auth";
import { cookies } from "next/headers";

export async function GET() {
  const { balance } = await getBalance();

  return Response.json({
    success: true,
    data: balance,
  });
}
