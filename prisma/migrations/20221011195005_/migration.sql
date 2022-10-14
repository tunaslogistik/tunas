/*
  Warnings:

  - Added the required column `koli` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_koli` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_volume` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_surat_jalan" ADD COLUMN     "koli" TEXT NOT NULL,
ADD COLUMN     "total_koli" TEXT NOT NULL,
ADD COLUMN     "total_volume" TEXT NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL;
