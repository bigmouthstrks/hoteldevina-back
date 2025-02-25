/*
  Warnings:

  - You are about to drop the column `workerId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_workerId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "workerId";

-- DropTable
DROP TABLE "Worker";
