/*
  Warnings:

  - Added the required column `tanggal_barang_terkirim` to the `daftar_workorder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_kapal_sandar` to the `daftar_workorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_workorder" ADD COLUMN     "komentar_barang_terkirim" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "komentar_kapal_sandar" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "photo_barang_terkirim" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "photo_kapal_sandar" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "tanggal_barang_terkirim" TEXT NOT NULL,
ADD COLUMN     "tanggal_kapal_sandar" TEXT NOT NULL;
