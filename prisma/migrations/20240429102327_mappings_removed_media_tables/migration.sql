/*
  Warnings:

  - You are about to drop the column `postId` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `medias` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `group_view` table. All the data in the column will be lost.
  - You are about to drop the column `viewerId` on the `group_view` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `in_group` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `in_group` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `post_view` table. All the data in the column will be lost.
  - You are about to drop the column `viewedAt` on the `post_view` table. All the data in the column will be lost.
  - You are about to drop the column `viewerId` on the `post_view` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `reportedUserId` on the `report` table. All the data in the column will be lost.
  - You are about to drop the `comment_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profile_pic` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[post_id,user_id]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id,viewer_id]` on the table `group_view` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id,user_id]` on the table `in_group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[post_id,viewer_id]` on the table `post_view` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `post_id` to the `bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `bookmarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `group_view` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_id` to the `group_view` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `in_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `in_group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `post_view` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_id` to the `post_view` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reported_user_id` to the `report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_postId_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "comment_media" DROP CONSTRAINT "comment_media_commentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "group" DROP CONSTRAINT "group_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "group_view" DROP CONSTRAINT "group_view_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_view" DROP CONSTRAINT "group_view_viewerId_fkey";

-- DropForeignKey
ALTER TABLE "in_group" DROP CONSTRAINT "in_group_groupId_fkey";

-- DropForeignKey
ALTER TABLE "in_group" DROP CONSTRAINT "in_group_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_view" DROP CONSTRAINT "post_view_postId_fkey";

-- DropForeignKey
ALTER TABLE "post_view" DROP CONSTRAINT "post_view_viewerId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_groupId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "user_profile_pic" DROP CONSTRAINT "user_profile_pic_userId_fkey";

-- DropIndex
DROP INDEX "bookmarks_postId_userId_key";

-- DropIndex
DROP INDEX "group_view_groupId_viewerId_key";

-- DropIndex
DROP INDEX "in_group_groupId_userId_key";

-- DropIndex
DROP INDEX "post_view_postId_viewerId_key";

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "postId",
DROP COLUMN "userId",
ADD COLUMN     "post_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authorId",
DROP COLUMN "medias",
DROP COLUMN "parentId",
DROP COLUMN "postId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "document" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "media" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "post_id" TEXT;

-- AlterTable
ALTER TABLE "group" DROP COLUMN "ownerId",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "group_view" DROP COLUMN "groupId",
DROP COLUMN "viewerId",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "viewer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "in_group" DROP COLUMN "groupId",
DROP COLUMN "userId",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "post_view" DROP COLUMN "postId",
DROP COLUMN "viewedAt",
DROP COLUMN "viewerId",
ADD COLUMN     "post_id" TEXT NOT NULL,
ADD COLUMN     "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "viewer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorId",
DROP COLUMN "groupId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "document" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "group_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "report" DROP COLUMN "createdAt",
DROP COLUMN "creatorId",
DROP COLUMN "reportedUserId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "reported_user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "comment_media";

-- DropTable
DROP TABLE "post_media";

-- DropTable
DROP TABLE "user_profile_pic";

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_post_id_user_id_key" ON "bookmarks"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_view_group_id_viewer_id_key" ON "group_view"("group_id", "viewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "in_group_group_id_user_id_key" ON "in_group"("group_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_view_post_id_viewer_id_key" ON "post_view"("post_id", "viewer_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view" ADD CONSTRAINT "post_view_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_view" ADD CONSTRAINT "post_view_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_group" ADD CONSTRAINT "in_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_group" ADD CONSTRAINT "in_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_view" ADD CONSTRAINT "group_view_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_view" ADD CONSTRAINT "group_view_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
