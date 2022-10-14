/*
  Warnings:

  - You are about to drop the column `estimated_date` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `koli` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `kota_tujuan` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `nama_barang` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_kendaraan` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_muat_barang` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `penerima` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `pengirim` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `posisi` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `satuan` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_masuk` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `total_koli` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `total_ttb` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `total_volume` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `daftar_surat_jalan` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `daftar_surat_pengantar` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_keberangkatan` on the `daftar_surat_pengantar` table. All the data in the column will be lost.
  - Added the required column `keterangan` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_keberangkatan` to the `daftar_surat_jalan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_date` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `koli` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kota_tujuan` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_barang` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_kendaraan` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_muat_barang` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penerima` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pengirim` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posisi` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `satuan` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_masuk` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_koli` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_ttb` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_volume` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `daftar_surat_pengantar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daftar_surat_jalan" DROP COLUMN "estimated_date",
DROP COLUMN "koli",
DROP COLUMN "kota_tujuan",
DROP COLUMN "nama_barang",
DROP COLUMN "nomor_kendaraan",
DROP COLUMN "nomor_muat_barang",
DROP COLUMN "penerima",
DROP COLUMN "pengirim",
DROP COLUMN "posisi",
DROP COLUMN "satuan",
DROP COLUMN "tanggal_masuk",
DROP COLUMN "total_koli",
DROP COLUMN "total_ttb",
DROP COLUMN "total_volume",
DROP COLUMN "volume",
ADD COLUMN     "keterangan" TEXT NOT NULL,
ADD COLUMN     "tanggal_keberangkatan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "daftar_surat_pengantar" DROP COLUMN "keterangan",
DROP COLUMN "tanggal_keberangkatan",
ADD COLUMN     "estimated_date" TEXT NOT NULL,
ADD COLUMN     "koli" TEXT NOT NULL,
ADD COLUMN     "kota_tujuan" TEXT NOT NULL,
ADD COLUMN     "nama_barang" TEXT NOT NULL,
ADD COLUMN     "nomor_kendaraan" TEXT NOT NULL,
ADD COLUMN     "nomor_muat_barang" TEXT NOT NULL,
ADD COLUMN     "penerima" TEXT NOT NULL,
ADD COLUMN     "pengirim" TEXT NOT NULL,
ADD COLUMN     "posisi" TEXT NOT NULL,
ADD COLUMN     "satuan" TEXT NOT NULL,
ADD COLUMN     "tanggal_masuk" TEXT NOT NULL,
ADD COLUMN     "total_koli" TEXT NOT NULL,
ADD COLUMN     "total_ttb" TEXT NOT NULL,
ADD COLUMN     "total_volume" TEXT NOT NULL,
ADD COLUMN     "volume" TEXT NOT NULL;
