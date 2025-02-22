/*
  Warnings:

  - Added the required column `capacity` to the `RoomType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "capacity" INTEGER NOT NULL;
