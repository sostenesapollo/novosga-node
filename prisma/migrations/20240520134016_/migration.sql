/*
  Warnings:

  - You are about to drop the `sensor_readings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "sensor_readings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "desk" TEXT NOT NULL
);
