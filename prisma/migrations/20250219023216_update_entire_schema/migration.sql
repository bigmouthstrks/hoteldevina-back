/*
  Warnings:

  - The primary key for the `Passenger` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Passenger` table. All the data in the column will be lost.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.
  - The primary key for the `RoomType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RoomType` table. All the data in the column will be lost.
  - The primary key for the `Worker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Worker` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_roomTypeId_fkey";

-- AlterTable
ALTER TABLE "Passenger" DROP CONSTRAINT "Passenger_pkey",
DROP COLUMN "id",
ADD COLUMN     "passengerId" SERIAL NOT NULL,
ALTER COLUMN "documentType" DROP NOT NULL,
ALTER COLUMN "documentNumber" DROP NOT NULL,
ADD CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passengerId");

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
ADD COLUMN     "roomId" SERIAL NOT NULL,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId");

-- AlterTable
ALTER TABLE "RoomType" DROP CONSTRAINT "RoomType_pkey",
DROP COLUMN "id",
ADD COLUMN     "roomTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "RoomType_pkey" PRIMARY KEY ("roomTypeId");

-- AlterTable
ALTER TABLE "Worker" DROP CONSTRAINT "Worker_pkey",
DROP COLUMN "id",
ADD COLUMN     "workerId" SERIAL NOT NULL,
ADD CONSTRAINT "Worker_pkey" PRIMARY KEY ("workerId");

-- CreateTable
CREATE TABLE "Reservation" (
    "reservationId" SERIAL NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "reservationStatusId" INTEGER NOT NULL,
    "confirmationStatusId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservationId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "documentType" TEXT,
    "documentNumber" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ReservationStatus" (
    "reservationStatusId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ReservationStatus_pkey" PRIMARY KEY ("reservationStatusId")
);

-- CreateTable
CREATE TABLE "ConfirmationStatus" (
    "confirmationStatusId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ConfirmationStatus_pkey" PRIMARY KEY ("confirmationStatusId")
);

-- CreateTable
CREATE TABLE "_PassengerToReservation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PassengerToReservation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PassengerToReservation_B_index" ON "_PassengerToReservation"("B");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("roomTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("roomTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("workerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "ReservationStatus"("reservationStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_confirmationStatusId_fkey" FOREIGN KEY ("confirmationStatusId") REFERENCES "ConfirmationStatus"("confirmationStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassengerToReservation" ADD CONSTRAINT "_PassengerToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "Passenger"("passengerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassengerToReservation" ADD CONSTRAINT "_PassengerToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservation"("reservationId") ON DELETE CASCADE ON UPDATE CASCADE;
