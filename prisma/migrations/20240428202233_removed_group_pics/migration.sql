/*
  Warnings:

  - You are about to drop the column `logo` on the `group` table. All the data in the column will be lost.
  - You are about to drop the `group_profile_pics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_profile_pics" DROP CONSTRAINT "group_profile_pics_groupId_fkey";

-- AlterTable
ALTER TABLE "group" DROP COLUMN "logo",
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "group_profile_pics";
