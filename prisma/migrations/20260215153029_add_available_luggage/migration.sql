/*
  Warnings:

  - Added the required column `availableLuggageCapacity` to the `Cab` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cab" ADD COLUMN     "availableLuggageCapacity" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Cab_availableLuggageCapacity_idx" ON "Cab"("availableLuggageCapacity");
