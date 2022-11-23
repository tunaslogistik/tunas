/*
  Warnings:

  - Added the required column `total_tagihan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "total_tagihan" TEXT NOT NULL;
