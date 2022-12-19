-- AlterTable
ALTER TABLE "daftar_sales_order" ADD COLUMN     "harga_satuan" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "harga_total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "itemNo" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "nama_barang" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "tipe_ppn" TEXT NOT NULL DEFAULT 'null';
