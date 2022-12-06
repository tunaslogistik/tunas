-- AlterTable
ALTER TABLE "accurate" ADD COLUMN     "percentTaxable" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "taxName" TEXT NOT NULL DEFAULT 'null';
