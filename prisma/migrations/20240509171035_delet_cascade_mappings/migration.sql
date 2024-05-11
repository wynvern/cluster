/*
  Warnings:

  - You are about to drop the `GroupChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "MessageView" DROP CONSTRAINT "MessageView_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageView" DROP CONSTRAINT "MessageView_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_report" DROP CONSTRAINT "post_report_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_view" DROP CONSTRAINT "post_view_post_id_fkey";

-- DropTable
DROP TABLE "GroupChat";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "MessageView";

-- DropTable
DROP TABLE "Reaction";

-- CreateTable
CREATE TABLE "group_chat" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "group_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replyToId" TEXT,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_view" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "message_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reaction" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_chat_groupId_key" ON "group_chat"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "message_view_userId_messageId_key" ON "message_view"("userId", "messageId");

-- AddForeignKey
ALTER TABLE "post_report" ADD CONSTRAINT "post_report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view" ADD CONSTRAINT "post_view_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_chat" ADD CONSTRAINT "group_chat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "group_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_view" ADD CONSTRAINT "message_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_view" ADD CONSTRAINT "message_view_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
