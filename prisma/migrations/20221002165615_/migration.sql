/*
  Warnings:

  - Changed the type of `last_update` on the `customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `last_update` on the `vechnicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `last_update` on the `vendor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "customer" DROP COLUMN "last_update",
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vechnicle" DROP COLUMN "last_update",
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vendor" DROP COLUMN "last_update",
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;
