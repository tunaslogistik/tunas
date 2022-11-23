/*
  Warnings:

  - Added the required column `tanggal_wo` to the `daftar_workorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_workorder" ADD COLUMN     "tanggal_wo" TEXT NOT NULL;
