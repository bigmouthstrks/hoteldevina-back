/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "totalAmount",
ADD COLUMN     "totalPrice" INTEGER NOT NULL;
