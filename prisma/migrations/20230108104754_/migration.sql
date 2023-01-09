-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "biaya_tambahan_non_ppn" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "biaya_tambahan_ppn" TEXT NOT NULL DEFAULT 'null';
