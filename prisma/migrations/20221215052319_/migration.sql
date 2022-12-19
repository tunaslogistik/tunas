/*
  Warnings:

  - You are about to drop the column `photo_muat_barang` on the `daftar_workorder` table. All the data in the column will be lost.
  - You are about to drop the column `photo_seal_destinasi` on the `daftar_workorder` table. All the data in the column will be lost.
  - You are about to drop the column `photo_seal_muatan` on the `daftar_workorder` table. All the data in the column will be lost.
  - You are about to drop the column `photo_surat_jalan` on the `daftar_workorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_workorder" DROP COLUMN "photo_muat_barang",
DROP COLUMN "photo_seal_destinasi",
DROP COLUMN "photo_seal_muatan",
DROP COLUMN "photo_surat_jalan",
ADD COLUMN     "photo_container_seal" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "photo_seal_pengantar" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "photo_surat_jalan_pabrik" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "photo_surat_jalan_stackful" TEXT NOT NULL DEFAULT 'null';
