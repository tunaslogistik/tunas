-- CreateTable
CREATE TABLE "settings" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "navigation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_menu" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "navigationId" TEXT NOT NULL,

    CONSTRAINT "navigation_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "cabang" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "read" TEXT[],
    "write" TEXT[],

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_harga" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "kode_asal" TEXT NOT NULL,
    "kode_tujuan" TEXT NOT NULL,
    "jenis_pengiriman" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "minimal_kubik" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "daftar_harga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_akun_biaya" (
    "id" SERIAL NOT NULL,
    "kode_biaya" TEXT NOT NULL,
    "nama_biaya" TEXT NOT NULL,
    "nomor_account" TEXT NOT NULL,
    "nama_account" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "daftar_akun_biaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_invoice" (
    "id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "kode_tujuan" TEXT NOT NULL,
    "alamat_tujuan" TEXT NOT NULL,
    "total_volume" INTEGER NOT NULL,
    "total_koli" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "full_container" TEXT NOT NULL,

    CONSTRAINT "daftar_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_muat_barang" (
    "id" SERIAL NOT NULL,
    "nomor_muat_barang" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "penerima" TEXT NOT NULL,
    "nomor_ttb" TEXT NOT NULL,
    "total_ttb" TEXT NOT NULL,
    "tanggal_masuk" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "koli" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "estimated_date" TEXT NOT NULL,
    "total_koli" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "total_volume" TEXT NOT NULL,
    "nomor_kendaraan" TEXT NOT NULL,
    "vendor_pelayanan" TEXT NOT NULL,
    "posisi" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,

    CONSTRAINT "daftar_muat_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_sales_order" (
    "id" SERIAL NOT NULL,
    "nomor_ttb" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "total_ttb" TEXT NOT NULL,
    "nomor_sales_order" TEXT NOT NULL,
    "total_volume" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "total_tagihan" INTEGER NOT NULL,
    "nama_kapal" TEXT NOT NULL,
    "tanggal_keberangkatan" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,
    "tanggal_sales_order" TEXT NOT NULL,
    "term_payment" TEXT NOT NULL,

    CONSTRAINT "daftar_sales_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_surat_jalan" (
    "id" SERIAL NOT NULL,
    "nomor_surat_jalan" TEXT NOT NULL,
    "nomor_muat_barang" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "penerima" TEXT NOT NULL,
    "nomor_ttb" TEXT NOT NULL,
    "total_ttb" TEXT NOT NULL,
    "tanggal_masuk" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "koli" TEXT NOT NULL,
    "estimated_date" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "total_koli" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "total_volume" TEXT NOT NULL,
    "nomor_kendaraan" TEXT NOT NULL,
    "vendor_pelayanan" TEXT NOT NULL,
    "posisi" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,

    CONSTRAINT "daftar_surat_jalan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_packing_list" (
    "id" SERIAL NOT NULL,
    "nomor_muat_barang" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "penerima" TEXT NOT NULL,
    "nomor_ttb" TEXT NOT NULL,
    "total_ttb" TEXT NOT NULL,
    "tanggal_masuk" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "koli" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "estimated_date" TEXT NOT NULL,
    "total_koli" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "total_volume" TEXT NOT NULL,
    "nomor_kendaraan" TEXT NOT NULL,
    "vendor_pelayanan" TEXT NOT NULL,
    "posisi" TEXT NOT NULL,
    "nomor_container" TEXT NOT NULL,
    "nomor_seal" TEXT NOT NULL,

    CONSTRAINT "daftar_packing_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_ttb" (
    "id" SERIAL NOT NULL,
    "ttb_number" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "kota_tujuan" TEXT NOT NULL,
    "tanggal_diterima" TEXT NOT NULL,
    "nama_penerima" TEXT NOT NULL,
    "jenis_pengiriman" TEXT NOT NULL,
    "nomor_telepon" TEXT NOT NULL,
    "total_volume" INTEGER NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "panjang" INTEGER NOT NULL,
    "lebar" INTEGER NOT NULL,
    "tinggi" INTEGER NOT NULL,
    "koli" INTEGER NOT NULL,
    "alamat_tujuan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "full_container" TEXT NOT NULL,

    CONSTRAINT "daftar_ttb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daftar_tujuan" (
    "id" SERIAL NOT NULL,
    "kode_tujuan" TEXT NOT NULL,
    "nama_tujuan" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "daftar_tujuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_pengiriman" (
    "id" SERIAL NOT NULL,
    "nama_pengiriman" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "jenis_pengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "id" SERIAL NOT NULL,
    "kode_vendor" TEXT NOT NULL,
    "nama_vendor" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "npwp" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "last_update" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "kode_customer" TEXT NOT NULL,
    "nama_customer" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" INTEGER NOT NULL,
    "npwp" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "tipe_ppn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "last_update" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vechnicle" (
    "id" SERIAL NOT NULL,
    "nomor_kendaraan" TEXT NOT NULL,
    "tipe_kendaraan" TEXT NOT NULL,
    "nama_supir" TEXT NOT NULL,
    "nama_kenek" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "last_update" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "vechnicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "navigation_menu" ADD CONSTRAINT "navigation_menu_navigationId_fkey" FOREIGN KEY ("navigationId") REFERENCES "navigation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_fkey" FOREIGN KEY ("role") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
