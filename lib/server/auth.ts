import { Balance, Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "./prisma";

export async function requireUserBySk<T extends Prisma.UserInclude | null>(
  include?: T,
): Promise<Prisma.UserGetPayload<{ include: T }>> {
  const token = cookies().get("token");

  if (!token?.value) {
    throw new Error("No session token found");
  }

  const session = await prisma.session.findFirst({
    where: {
      token: token.value,
    },
    include: {
      user: {
        include,
      },
    },
  });

  if (!session) {
    throw new Error("No session found");
  }

  if (!session.user) {
    throw new Error("No user found");
  }

  return session.user as Prisma.UserGetPayload<{ include: T }>;
}

export async function getBalance(): Promise<{
  user: Prisma.UserGetPayload<{ include: { balance: true } }>;
  balance: Balance;
}> {
  const user = await requireUserBySk({ balance: true });

  if (!user) {
    throw new Error("User is required for getBalance");
  }

  if (!user.balance) {
    return {
      balance: await prisma.balance.create({
        data: {
          userID: user.id,
          balance: 0,
        },
      }),
      user,
    };
  }

  return { balance: user.balance, user };
}
