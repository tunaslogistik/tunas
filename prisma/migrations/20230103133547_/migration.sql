/*
  Warnings:

  - Added the required column `accurate` to the `daftar_ttb` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ppn` to the `daftar_ttb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_ttb" ADD COLUMN     "accurate" TEXT NOT NULL,
ADD COLUMN     "ppn" TEXT NOT NULL;
