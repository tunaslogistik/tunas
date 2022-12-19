/*
  Warnings:

  - You are about to drop the column `photo_seal_pengantar` on the `daftar_workorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daftar_workorder" DROP COLUMN "photo_seal_pengantar",
ADD COLUMN     "photo_surat_pengantar" TEXT NOT NULL DEFAULT 'null';
