/*
  Warnings:

  - You are about to drop the column `keterangan` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - Added the required column `term_payment` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_muat_barang` to the `daftar_muat_barang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dp` to the `daftar_sales_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "term_payment" TEXT NOT NULL,
ALTER COLUMN "telepon" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "daftar_muat_barang" ADD COLUMN     "tanggal_muat_barang" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "daftar_sales_order" ADD COLUMN     "dp" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "daftar_surat_jalan" DROP COLUMN "keterangan";

-- CreateTable
CREATE TABLE "pengaturan" (
    "id" SERIAL NOT NULL,
    "nama_pt" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "nama_rekening" TEXT NOT NULL,
    "no_rekening" TEXT NOT NULL,

    CONSTRAINT "pengaturan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_surat_pengantar" (
    "id" SERIAL NOT NULL,
    "nomor_surat_jalan" TEXT NOT NULL,
    "nomor_ttb" TEXT NOT NULL,
    "vendor_pelayanan" TEXT NOT NULL,
    "tanggal_keberangkatan" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "daftar_surat_pengantar_pkey" PRIMARY KEY ("id")
);
