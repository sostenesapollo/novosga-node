-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "desk" TEXT NOT NULL,
    "waiting" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tickets" ("desk", "id", "number", "priority", "waiting") SELECT "desk", "id", "number", "priority", "waiting" FROM "tickets";
DROP TABLE "tickets";
ALTER TABLE "new_tickets" RENAME TO "tickets";
PRAGMA foreign_key_check("tickets");
PRAGMA foreign_keys=ON;
