/*
  Warnings:

  - You are about to drop the column `alamat_tujuan` on the `daftar_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `full_container` on the `daftar_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_number` on the `daftar_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `kode_tujuan` on the `daftar_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `pengirim` on the `daftar_invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `daftar_invoice` table. All the data in the column will be lost.
  - Added the required column `keterangan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `koli` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_kapal` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_container` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_invoice` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_seal` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_ttb` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_invoice` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_keberangkatan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor_pelayanan` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `daftar_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_invoice" DROP COLUMN "alamat_tujuan",
DROP COLUMN "full_container",
DROP COLUMN "invoice_number",
DROP COLUMN "kode_tujuan",
DROP COLUMN "pengirim",
DROP COLUMN "status",
ADD COLUMN     "keterangan" TEXT NOT NULL,
ADD COLUMN     "koli" TEXT NOT NULL,
ADD COLUMN     "nama_kapal" TEXT NOT NULL,
ADD COLUMN     "nomor_container" TEXT NOT NULL,
ADD COLUMN     "nomor_invoice" TEXT NOT NULL,
ADD COLUMN     "nomor_seal" TEXT NOT NULL,
ADD COLUMN     "nomor_ttb" TEXT NOT NULL,
ADD COLUMN     "tanggal_invoice" TEXT NOT NULL,
ADD COLUMN     "tanggal_keberangkatan" TEXT NOT NULL,
ADD COLUMN     "vendor_pelayanan" TEXT NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL,
ALTER COLUMN "total_volume" SET DATA TYPE TEXT,
ALTER COLUMN "total_koli" SET DATA TYPE TEXT;
