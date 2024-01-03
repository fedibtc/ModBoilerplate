import { getBalance } from "@/lib/server/auth";

export async function GET() {
  try {
    const { balance } = await getBalance();

    return Response.json({
      success: true,
      data: balance,
    });
  } catch (e) {
    return Response.json({
      success: false,
      message: (e as Error).message,
    });
  }
}
