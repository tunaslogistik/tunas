/*
  Warnings:

  - Added the required column `nomor_packing_list` to the `daftar_packing_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_packing_list" ADD COLUMN     "nomor_packing_list" TEXT NOT NULL;
