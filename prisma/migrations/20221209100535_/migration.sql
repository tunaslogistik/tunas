-- CreateTable
CREATE TABLE "daftar_biaya_tambahan" (
    "id" SERIAL NOT NULL,
    "nomor_invoice" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "jenis_biaya_tambahan" TEXT NOT NULL,
    "harga_biaya_tambahan" TEXT NOT NULL,
    "id_biaya_tambahan" TEXT NOT NULL,

    CONSTRAINT "daftar_biaya_tambahan_pkey" PRIMARY KEY ("id")
);
