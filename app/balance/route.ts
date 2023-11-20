import { getBalance, requireNpub } from "@/lib/server/auth";

export async function GET() {
  try {
    const npub = requireNpub();

    return Response.json({
      success: true,
      data: await getBalance(npub),
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: (err as Error).message,
    });
  }
}
