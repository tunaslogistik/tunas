/*
  Warnings:

  - Added the required column `rekening` to the `daftar_sales_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `container_size` to the `daftar_ttb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_sales_order" ADD COLUMN     "rekening" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "daftar_ttb" ADD COLUMN     "container_size" TEXT NOT NULL;
