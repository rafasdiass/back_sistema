-- AlterTable
ALTER TABLE "User" ADD COLUMN     "comercialId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_comercialId_fkey" FOREIGN KEY ("comercialId") REFERENCES "Comercial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
