/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "address" JSONB;

-- AlterTable
ALTER TABLE "Comercial" ADD COLUMN "address" JSONB;

-- AlterTable
ALTER TABLE "Cooperado" ADD COLUMN "address" JSONB;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Address";
PRAGMA foreign_keys=on;
