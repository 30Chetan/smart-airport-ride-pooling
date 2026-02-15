-- CreateTable
CREATE TABLE "CabAssignment" (
    "id" TEXT NOT NULL,
    "cabId" TEXT NOT NULL,
    "rideRequestId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CabAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CabAssignment_rideRequestId_key" ON "CabAssignment"("rideRequestId");

-- CreateIndex
CREATE INDEX "CabAssignment_cabId_idx" ON "CabAssignment"("cabId");

-- CreateIndex
CREATE INDEX "CabAssignment_rideRequestId_idx" ON "CabAssignment"("rideRequestId");

-- AddForeignKey
ALTER TABLE "CabAssignment" ADD CONSTRAINT "CabAssignment_cabId_fkey" FOREIGN KEY ("cabId") REFERENCES "Cab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabAssignment" ADD CONSTRAINT "CabAssignment_rideRequestId_fkey" FOREIGN KEY ("rideRequestId") REFERENCES "RideRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
