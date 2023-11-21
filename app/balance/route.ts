import { getBalance } from "@/lib/server/auth";

export async function GET() {
  const balance = await getBalance();

  return Response.json({
    success: true,
    data: balance,
  });
}
