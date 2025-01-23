/*
  Warnings:

  - You are about to drop the column `username` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Comercial` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Cooperado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Comercial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Cooperado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Comercial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Cooperado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "username",
ADD COLUMN     "cpf" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comercial" DROP COLUMN "username",
ADD COLUMN     "cpf" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cooperado" DROP COLUMN "username",
ADD COLUMN     "cpf" TEXT NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_cpf_key" ON "Admin"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Comercial_cpf_key" ON "Comercial"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperado_cpf_key" ON "Cooperado"("cpf");
