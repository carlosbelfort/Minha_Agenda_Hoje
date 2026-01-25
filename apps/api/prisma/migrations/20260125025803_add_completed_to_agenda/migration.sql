/*
  Warnings:

  - Added the required column `updatedAt` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agenda"
ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

