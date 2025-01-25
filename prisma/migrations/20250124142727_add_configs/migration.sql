-- CreateTable
CREATE TABLE "Configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taxaJuros" REAL NOT NULL DEFAULT 2.5,
    "vencimento" INTEGER NOT NULL DEFAULT 10,
    "notificacao" BOOLEAN NOT NULL DEFAULT true
);
