/*
  Warnings:

  - Added the required column `harga_biaya_tambahan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ppn_biaya_tambahan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "harga_biaya_tambahan" TEXT NOT NULL,
ADD COLUMN     "ppn_biaya_tambahan" TEXT NOT NULL;
