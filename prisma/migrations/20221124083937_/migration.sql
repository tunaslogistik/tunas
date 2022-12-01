/*
  Warnings:

  - Added the required column `akun_penjualan` to the `accurate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accurate" ADD COLUMN     "akun_penjualan" TEXT NOT NULL;
