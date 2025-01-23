/*
  Warnings:

  - Added the required column `comercialId` to the `Cooperado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cooperado" ADD COLUMN     "comercialId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cooperado" ADD CONSTRAINT "Cooperado_comercialId_fkey" FOREIGN KEY ("comercialId") REFERENCES "Comercial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
