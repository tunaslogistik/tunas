/*
  Warnings:

  - Added the required column `updated_bya` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "updated_bya" TEXT NOT NULL;
