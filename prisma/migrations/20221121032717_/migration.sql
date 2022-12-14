-- CreateTable
CREATE TABLE "daftar_workorder" (
    "id" SERIAL NOT NULL,
    "nomor_workorder" TEXT NOT NULL,
    "kendaraan" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "komentar_container" TEXT NOT NULL DEFAULT 'null',
    "komentar_muat_barang" TEXT NOT NULL DEFAULT 'null',
    "komentar_menuju_pelabuhan" TEXT NOT NULL DEFAULT 'null',
    "komentar_tiba_pelabuhan" TEXT NOT NULL DEFAULT 'null',
    "komentar_muatan" TEXT NOT NULL DEFAULT 'null',
    "komentar_destinasi" TEXT NOT NULL DEFAULT 'null',
    "tanggal_container" TEXT NOT NULL,
    "tanggal_muat_barang" TEXT NOT NULL,
    "tanggal_menuju_pelabuhan" TEXT NOT NULL,
    "tanggal_tiba_pelabuhan" TEXT NOT NULL,
    "tanggal_muatan" TEXT NOT NULL,
    "tanggal_destinasi" TEXT NOT NULL,
    "nomor_kendaraan" TEXT NOT NULL,
    "nama_supir" TEXT NOT NULL,
    "nama_kenek" TEXT NOT NULL,
    "wa_supir" TEXT NOT NULL,
    "wa_kenek" TEXT NOT NULL,
    "photo_container" TEXT NOT NULL DEFAULT 'null',
    "photo_seal_pelabuhan" TEXT NOT NULL DEFAULT 'null',
    "photo_surat_jalan" TEXT NOT NULL DEFAULT 'null',
    "photo_muat_barang" TEXT NOT NULL DEFAULT 'null',
    "photo_seal_muatan" TEXT NOT NULL DEFAULT 'null',
    "photo_seal_destinasi" TEXT NOT NULL DEFAULT 'null',
    "status" TEXT NOT NULL DEFAULT 'null',

    CONSTRAINT "daftar_workorder_pkey" PRIMARY KEY ("id")
);
