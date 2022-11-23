/*
  Warnings:

  - Added the required column `harga_sebelum_ppn` to the `daftar_sales_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_sales_order" ADD COLUMN     "harga_sebelum_ppn" INTEGER NOT NULL;
