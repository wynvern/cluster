/*
  Warnings:

  - You are about to drop the `code_reset_password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `code_verify_account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subscription]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "code_reset_password";

-- DropTable
DROP TABLE "code_verify_account";

-- CreateTable
CREATE TABLE "password_reset_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verify_account_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verify_account_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_code_code_key" ON "password_reset_code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "verify_account_code_code_key" ON "verify_account_code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_subscription_key" ON "subscription"("subscription");
