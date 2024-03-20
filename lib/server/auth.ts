import { cookies } from "next/headers";
import prisma from "./prisma";

export async function getSession() {
  const token = cookies().get("session");

  if (!token?.value) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      token: token.value,
    },
    include: {
      user: true,
    },
  });

  return session;
}

export async function getBalance() {
  const token = cookies().get("session");

  if (!token?.value) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      token: token.value,
    },
    include: {
      user: {
        include: {
          balance: true,
        },
      },
    },
  });

  if (!session?.user) return null;

  return {
    balance: await prisma.balance.upsert({
      where: { userID: session.user.id },
      update: {},
      create: {
        userID: session.user.id,
        balance: 0,
      },
    }),
    user: session.user,
  };
}
