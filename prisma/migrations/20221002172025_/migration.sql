/*
  Warnings:

  - Changed the type of `tanggal_keberangkatan` on the `daftar_sales_order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tanggal_sales_order` on the `daftar_sales_order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "daftar_sales_order" DROP COLUMN "tanggal_keberangkatan",
ADD COLUMN     "tanggal_keberangkatan" TIMESTAMP(3) NOT NULL,
DROP COLUMN "tanggal_sales_order",
ADD COLUMN     "tanggal_sales_order" TIMESTAMP(3) NOT NULL;
