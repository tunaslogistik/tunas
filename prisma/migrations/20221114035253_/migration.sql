/*
  Warnings:

  - Added the required column `harga` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_barang` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "harga" TEXT NOT NULL,
ADD COLUMN     "nama_barang" TEXT NOT NULL;
