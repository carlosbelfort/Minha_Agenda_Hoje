/*
  Warnings:

  - Added the required column `publicId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo"
ADD COLUMN "publicId" TEXT;

UPDATE "Photo"
SET "publicId" = 'legacy_' || id;

ALTER TABLE "Photo"
ALTER COLUMN "publicId" SET NOT NULL;
