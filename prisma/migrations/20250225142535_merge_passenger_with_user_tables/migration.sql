/*
  Warnings:

  - You are about to drop the `Passenger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PassengerToReservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PassengerToReservation" DROP CONSTRAINT "_PassengerToReservation_A_fkey";

-- DropForeignKey
ALTER TABLE "_PassengerToReservation" DROP CONSTRAINT "_PassengerToReservation_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- DropTable
DROP TABLE "Passenger";

-- DropTable
DROP TABLE "_PassengerToReservation";
