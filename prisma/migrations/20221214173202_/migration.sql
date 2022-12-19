-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "biaya_tambahan_join" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "biaya_tambahan_sales" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "itemNo_join" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "itemNo_sales_order" TEXT NOT NULL DEFAULT 'null';
