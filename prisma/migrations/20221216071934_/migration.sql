-- CreateTable
CREATE TABLE "reference_ttb" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_ttb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_sales_order" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_sales_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_muat_barang" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_muat_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_packing_list" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_packing_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_surat_pengantar" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_surat_pengantar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_surat_jalan" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_surat_jalan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_invoice" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL DEFAULT 'null',
    "kota_tujuan" TEXT NOT NULL DEFAULT 'null',
    "tanggal_tahun" TEXT NOT NULL DEFAULT 'null',
    "increment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "reference_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_workorder" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "tanggal_tahun" TEXT NOT NULL,
    "increment" INTEGER NOT NULL,

    CONSTRAINT "reference_workorder_pkey" PRIMARY KEY ("id")
);
