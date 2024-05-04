/*
  Warnings:

  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_post_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "group_member" DROP CONSTRAINT "group_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_view" DROP CONSTRAINT "group_view_viewer_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_view" DROP CONSTRAINT "post_view_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_view" DROP CONSTRAINT "post_view_viewer_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_group_id_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_reported_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- AlterTable
ALTER TABLE "group" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guidelines" TEXT;

-- DropTable
DROP TABLE "bookmarks";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "banner" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "document" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "group_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banned_group_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banned_group_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_setting" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "post_approval" BOOLEAN NOT NULL DEFAULT false,
    "member_approval" BOOLEAN NOT NULL DEFAULT false,
    "member_posting" BOOLEAN NOT NULL DEFAULT false,
    "member_joining" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "creator_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_user_user_id_blocked_id_key" ON "blocked_user"("user_id", "blocked_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_post_id_user_id_key" ON "bookmark"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "banned_group_user_group_id_user_id_key" ON "banned_group_user"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_setting_group_id_key" ON "group_setting"("group_id");

-- AddForeignKey
ALTER TABLE "blocked_user" ADD CONSTRAINT "blocked_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_user" ADD CONSTRAINT "blocked_user_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view" ADD CONSTRAINT "post_view_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view" ADD CONSTRAINT "post_view_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned_group_user" ADD CONSTRAINT "banned_group_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned_group_user" ADD CONSTRAINT "banned_group_user_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_setting" ADD CONSTRAINT "group_setting_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_report" ADD CONSTRAINT "group_report_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_report" ADD CONSTRAINT "group_report_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_view" ADD CONSTRAINT "group_view_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
