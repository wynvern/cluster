/*
  Warnings:

  - You are about to drop the column `owner_id` on the `group` table. All the data in the column will be lost.
  - You are about to drop the `in_group` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('member', 'moderator', 'owner');

-- DropForeignKey
ALTER TABLE "group" DROP CONSTRAINT "group_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "in_group" DROP CONSTRAINT "in_group_group_id_fkey";

-- DropForeignKey
ALTER TABLE "in_group" DROP CONSTRAINT "in_group_user_id_fkey";

-- AlterTable
ALTER TABLE "group" DROP COLUMN "owner_id";

-- DropTable
DROP TABLE "in_group";

-- CreateTable
CREATE TABLE "group_member" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',

    CONSTRAINT "group_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_member_group_id_user_id_key" ON "group_member"("group_id", "user_id");

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
