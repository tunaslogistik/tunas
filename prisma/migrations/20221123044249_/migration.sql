/*
  Warnings:

  - Added the required column `kode_barang` to the `accurate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pengirim` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accurate" ADD COLUMN     "kode_barang" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "pengirim" TEXT NOT NULL;
