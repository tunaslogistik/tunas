/*
  Warnings:

  - Added the required column `pembayar` to the `daftar_ttb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_ttb" ADD COLUMN     "pembayar" TEXT NOT NULL;
