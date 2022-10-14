/*
  Warnings:

  - You are about to drop the column `nama_kapal` on the `daftar_muat_barang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_muat_barang" DROP COLUMN "nama_kapal",
ADD COLUMN     "nama_kapal" TEXT NOT NULL DEFAULT 'null';
