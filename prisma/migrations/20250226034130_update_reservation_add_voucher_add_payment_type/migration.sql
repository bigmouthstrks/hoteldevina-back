/*
  Warnings:

  - Added the required column `nightsCount` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passengerCount` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_reservationId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "checkInWorker" TEXT,
ADD COLUMN     "checkOutWorker" TEXT,
ADD COLUMN     "nightsCount" INTEGER NOT NULL,
ADD COLUMN     "passengerCount" INTEGER NOT NULL,
ADD COLUMN     "passengerNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "paymentMethodId" INTEGER,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "isAvailable" SET DEFAULT true;

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "features" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "queenBedCount" SET DEFAULT 0,
ALTER COLUMN "singleBedCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'passenger';

-- CreateTable
CREATE TABLE "ReservationRoom" (
    "roomId" INTEGER NOT NULL,
    "reservationId" INTEGER NOT NULL,

    CONSTRAINT "ReservationRoom_pkey" PRIMARY KEY ("roomId","reservationId")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "voucherId" SERIAL NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Boleta',
    "companyName" TEXT,
    "address" TEXT,
    "businessActivity" TEXT,
    "reservationId" INTEGER NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("voucherId")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "paymentMethodId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("paymentMethodId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_reservationId_key" ON "Voucher"("reservationId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("paymentMethodId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservationStatusId_fkey" FOREIGN KEY ("reservationStatusId") REFERENCES "ReservationStatus"("reservationStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationRoom" ADD CONSTRAINT "ReservationRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationRoom" ADD CONSTRAINT "ReservationRoom_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("reservationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("reservationId") ON DELETE CASCADE ON UPDATE CASCADE;
