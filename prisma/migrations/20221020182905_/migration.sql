/*
  Warnings:

  - Added the required column `nomor_surat_jalan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "nomor_surat_jalan" TEXT NOT NULL;
