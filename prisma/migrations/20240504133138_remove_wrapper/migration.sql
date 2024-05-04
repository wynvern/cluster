/*
  Warnings:

  - You are about to drop the `group_moderator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_moderator" DROP CONSTRAINT "group_moderator_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_moderator" DROP CONSTRAINT "group_moderator_user_id_fkey";

-- AlterTable
ALTER TABLE "group_member" ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "group_moderator";
