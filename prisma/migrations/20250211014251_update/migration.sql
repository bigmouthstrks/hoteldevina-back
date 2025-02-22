/*
  Warnings:

  - You are about to drop the column `bedNumber` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `promotionPrice` on the `Room` table. All the data in the column will be lost.
  - Added the required column `price` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionPrice` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queenBedCount` to the `RoomType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `singleBedCount` to the `RoomType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "bedNumber",
DROP COLUMN "price",
DROP COLUMN "promotionPrice";

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "features" TEXT[],
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "promotionPrice" INTEGER NOT NULL,
ADD COLUMN     "queenBedCount" INTEGER NOT NULL,
ADD COLUMN     "singleBedCount" INTEGER NOT NULL;
