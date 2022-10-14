/*
  Warnings:

  - You are about to drop the column `nomor_container` on the `daftar_sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_seal` on the `daftar_sales_order` table. All the data in the column will be lost.
  - You are about to drop the column `total_ttb` on the `daftar_sales_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_sales_order" DROP COLUMN "nomor_container",
DROP COLUMN "nomor_seal",
DROP COLUMN "total_ttb";
