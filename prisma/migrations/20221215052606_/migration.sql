/*
  Warnings:

  - Added the required column `nama_kapal` to the `daftar_workorder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_workorder" ADD COLUMN     "nama_kapal" TEXT NOT NULL;
