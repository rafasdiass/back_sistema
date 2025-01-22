/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_comercialId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Cooperado" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "comercialId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Cooperado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cooperado_email_key" ON "Cooperado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cooperado_cpf_key" ON "Cooperado"("cpf");

-- AddForeignKey
ALTER TABLE "Cooperado" ADD CONSTRAINT "Cooperado_comercialId_fkey" FOREIGN KEY ("comercialId") REFERENCES "Comercial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
