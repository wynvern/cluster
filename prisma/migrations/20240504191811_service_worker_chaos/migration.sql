/*
  Warnings:

  - You are about to drop the column `member_approval` on the `group_setting` table. All the data in the column will be lost.
  - You are about to drop the column `post_approval` on the `group_setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group_setting" DROP COLUMN "member_approval",
DROP COLUMN "post_approval";

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userId" ON "PushSubscription"("userId");

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
