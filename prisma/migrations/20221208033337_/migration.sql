-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "id_biaya_tambahan" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "id_biaya_utama" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "jenis_biaya_tambahan" TEXT NOT NULL DEFAULT 'null';
