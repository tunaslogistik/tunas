/*
  Warnings:

  - You are about to drop the column `nama_kapal` on the `daftar_sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_keberangkatan` on the `daftar_sales_order` table. All the data in the column will be lost.
  - Added the required column `nama_kapal` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_muat_barang" ADD COLUMN     "nama_kapal" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "daftar_sales_order" DROP COLUMN "nama_kapal",
DROP COLUMN "tanggal_keberangkatan";

-- AlterTable
ALTER TABLE "daftar_surat_jalan" ADD COLUMN     "nama_kapal" TEXT NOT NULL;
