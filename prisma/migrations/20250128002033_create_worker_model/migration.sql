-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "rut" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "contractTypeId" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);
