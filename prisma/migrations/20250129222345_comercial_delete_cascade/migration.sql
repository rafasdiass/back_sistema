-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cooperado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COOPERADO',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB,
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "comercialId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Cooperado_comercialId_fkey" FOREIGN KEY ("comercialId") REFERENCES "Comercial" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cooperado" ("address", "comercialId", "cpf", "createdAt", "email", "first_name", "id", "isFirstLogin", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt") SELECT "address", "comercialId", "cpf", "createdAt", "email", "first_name", "id", "isFirstLogin", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt" FROM "Cooperado";
DROP TABLE "Cooperado";
ALTER TABLE "new_Cooperado" RENAME TO "Cooperado";
CREATE UNIQUE INDEX "Cooperado_cpf_key" ON "Cooperado"("cpf");
CREATE UNIQUE INDEX "Cooperado_email_key" ON "Cooperado"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
