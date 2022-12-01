/*
  Warnings:

  - Added the required column `subtotal` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal_tambahan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "subtotal" TEXT NOT NULL,
ADD COLUMN     "subtotal_tambahan" TEXT NOT NULL,
ADD COLUMN     "tax" TEXT NOT NULL;
