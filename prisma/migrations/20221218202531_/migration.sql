-- AlterTable
ALTER TABLE "reference_invoice" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_muat_barang" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_packing_list" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_sales_order" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_surat_jalan" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_surat_pengantar" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';

-- AlterTable
ALTER TABLE "reference_ttb" ADD COLUMN     "bulan_tahun" TEXT NOT NULL DEFAULT 'null';
