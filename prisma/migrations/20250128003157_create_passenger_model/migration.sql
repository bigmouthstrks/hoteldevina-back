-- CreateTable
CREATE TABLE "Passenger" (
    "id" SERIAL NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
);
