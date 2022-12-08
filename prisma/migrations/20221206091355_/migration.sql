/*
  Warnings:

  - Added the required column `kota_tujuan` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_surat_jalan" ADD COLUMN     "kota_tujuan" TEXT NOT NULL;
