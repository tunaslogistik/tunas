-- CreateTable
CREATE TABLE "accurate" (
    "id" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "salesDiscountGlAccountId" TEXT NOT NULL DEFAULT 'null',
    "salesGlAccountId" TEXT NOT NULL DEFAULT 'null',
    "inventoryGlAccountId" TEXT NOT NULL DEFAULT 'null',

    CONSTRAINT "accurate_pkey" PRIMARY KEY ("id")
);
