-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark');

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "private_profile" BOOLEAN NOT NULL DEFAULT false,
    "private_bookmarks" BOOLEAN NOT NULL DEFAULT false,
    "private_groups" BOOLEAN NOT NULL DEFAULT false,
    "disable_notifications" BOOLEAN NOT NULL DEFAULT false,
    "theme" "Theme" NOT NULL DEFAULT 'light',

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
