/*
  Warnings:

  - You are about to drop the column `content` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - Added the required column `body` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "content",
ADD COLUMN     "body" VARCHAR(3000) NOT NULL;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "content",
ADD COLUMN     "body" VARCHAR(10000) NOT NULL;
