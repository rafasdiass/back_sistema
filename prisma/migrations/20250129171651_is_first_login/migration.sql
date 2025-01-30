-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB,
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Admin" ("address", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt") SELECT "address", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_cpf_key" ON "Admin"("cpf");
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE TABLE "new_Comercial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COMERCIAL',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" JSONB,
    "registration_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Comercial" ("address", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt") SELECT "address", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt" FROM "Comercial";
DROP TABLE "Comercial";
ALTER TABLE "new_Comercial" RENAME TO "Comercial";
CREATE UNIQUE INDEX "Comercial_cpf_key" ON "Comercial"("cpf");
CREATE UNIQUE INDEX "Comercial_email_key" ON "Comercial"("email");
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
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Cooperado_comercialId_fkey" FOREIGN KEY ("comercialId") REFERENCES "Comercial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cooperado" ("address", "comercialId", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt") SELECT "address", "comercialId", "cpf", "createdAt", "email", "first_name", "id", "is_active", "last_name", "password", "phone", "registration_date", "role", "updatedAt" FROM "Cooperado";
DROP TABLE "Cooperado";
ALTER TABLE "new_Cooperado" RENAME TO "Cooperado";
CREATE UNIQUE INDEX "Cooperado_cpf_key" ON "Cooperado"("cpf");
CREATE UNIQUE INDEX "Cooperado_email_key" ON "Cooperado"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
