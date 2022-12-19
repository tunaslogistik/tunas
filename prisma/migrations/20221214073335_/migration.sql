/*
  Warnings:

  - You are about to drop the column `harga_sebelum_ppn` on the `daftar_sales_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_sales_order" DROP COLUMN "harga_sebelum_ppn",
ADD COLUMN     "harga_sesudah_ppn" INTEGER NOT NULL DEFAULT 0;
