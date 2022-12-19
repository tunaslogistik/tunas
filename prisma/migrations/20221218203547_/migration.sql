-- AlterTable
ALTER TABLE "reference_workorder" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null',
ALTER COLUMN "kode_tujuan" SET DEFAULT 'null',
ALTER COLUMN "kota_tujuan" SET DEFAULT 'null',
ALTER COLUMN "tanggal_tahun" SET DEFAULT 'null';
