-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "nama_barang_join" TEXT NOT NULL DEFAULT 'null';
