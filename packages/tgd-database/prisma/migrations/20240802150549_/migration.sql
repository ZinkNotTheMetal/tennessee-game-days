/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_barcode_key" ON "attendees"("barcode");
