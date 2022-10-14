/*
  Warnings:

  - Added the required column `tanggal_surat_jalan` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_surat_jalan" ADD COLUMN     "tanggal_surat_jalan" TEXT NOT NULL;
