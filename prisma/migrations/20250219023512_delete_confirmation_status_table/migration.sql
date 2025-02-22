/*
  Warnings:

  - You are about to drop the column `confirmationStatusId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `ConfirmationStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_confirmationStatusId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "confirmationStatusId";

-- DropTable
DROP TABLE "ConfirmationStatus";
