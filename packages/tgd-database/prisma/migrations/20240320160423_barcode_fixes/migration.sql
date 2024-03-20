/*
  Warnings:

  - A unique constraint covering the columns `[person_id,convention_id]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode` to the `attendees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convention_id` to the `attendees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendees" ADD COLUMN     "barcode" TEXT NOT NULL,
ADD COLUMN     "convention_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attendees_person_id_convention_id_key" ON "attendees"("person_id", "convention_id");

-- AddForeignKey
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_barcode_fkey" FOREIGN KEY ("barcode") REFERENCES "centralized_barcodes"("barcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_items" ADD CONSTRAINT "play_to_win_items_barcode_fkey" FOREIGN KEY ("barcode") REFERENCES "centralized_barcodes"("barcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_convention_id_fkey" FOREIGN KEY ("convention_id") REFERENCES "conventions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_barcode_fkey" FOREIGN KEY ("barcode") REFERENCES "centralized_barcodes"("barcode") ON DELETE RESTRICT ON UPDATE CASCADE;
