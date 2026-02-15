-- CreateEnum
CREATE TYPE "CabStatus" AS ENUM ('AVAILABLE', 'FULL', 'OFFLINE');

-- CreateTable
CREATE TABLE "Cab" (
    "id" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "luggageCapacity" INTEGER NOT NULL,
    "status" "CabStatus" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cab_status_idx" ON "Cab"("status");

-- CreateIndex
CREATE INDEX "Cab_availableSeats_idx" ON "Cab"("availableSeats");
