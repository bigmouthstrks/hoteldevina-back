-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "address" INTEGER,
ADD COLUMN     "arrivalTime" TEXT,
ADD COLUMN     "carPatent" INTEGER,
ADD COLUMN     "city" INTEGER,
ADD COLUMN     "leaveTime" TEXT;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "city" TEXT;
