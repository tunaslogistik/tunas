/*
  Warnings:

  - Added the required column `origin` to the `daftar_muat_barang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_muat_barang" ADD COLUMN     "origin" TEXT NOT NULL;
