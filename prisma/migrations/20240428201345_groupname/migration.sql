/*
  Warnings:

  - You are about to drop the column `groupName` on the `group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupname]` on the table `group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupname` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "group_name_key";

-- AlterTable
ALTER TABLE "group" DROP COLUMN "groupName",
ADD COLUMN     "groupname" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "group_groupname_key" ON "group"("groupname");
