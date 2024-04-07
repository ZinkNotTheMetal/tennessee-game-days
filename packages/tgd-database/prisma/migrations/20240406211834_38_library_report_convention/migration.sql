-- AlterTable
ALTER TABLE "library_checkout_events" ADD COLUMN     "convention_id" INTEGER;

-- AddForeignKey
ALTER TABLE "library_checkout_events" ADD CONSTRAINT "library_checkout_events_convention_id_fkey" FOREIGN KEY ("convention_id") REFERENCES "conventions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
