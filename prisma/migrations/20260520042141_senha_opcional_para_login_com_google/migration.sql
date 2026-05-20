/*
  Warnings:

  - You are about to drop the column `google_id` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "google_id",
ALTER COLUMN "password" DROP NOT NULL;
