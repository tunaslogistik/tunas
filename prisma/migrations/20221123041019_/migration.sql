/*
  Warnings:

  - The primary key for the `accurate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `accurate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `accurate` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accurate" DROP CONSTRAINT "accurate_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "accurate_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "daftar_invoice" ADD COLUMN     "accurate" TEXT NOT NULL;
