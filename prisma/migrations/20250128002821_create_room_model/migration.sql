-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "price" INTEGER NOT NULL,
    "promotionPrice" INTEGER NOT NULL,
    "bedNumber" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
