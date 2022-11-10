/*
  Warnings:

  - Added the required column `nomor_kenek` to the `vechnicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_supir` to the `vechnicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vechnicle" ADD COLUMN     "nomor_kenek" TEXT NOT NULL,
ADD COLUMN     "nomor_supir" TEXT NOT NULL;
