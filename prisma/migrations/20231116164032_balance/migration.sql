-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "pubkey" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);
