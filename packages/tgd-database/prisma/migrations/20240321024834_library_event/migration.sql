/*
  Warnings:

  - You are about to drop the column `libary_game_barcode_scanned` on the `library_checkout_events` table. All the data in the column will be lost.
  - Made the column `checked_in_time_utc` on table `library_checkout_events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "library_checkout_events" DROP COLUMN "libary_game_barcode_scanned",
ALTER COLUMN "checked_out_time_utc" DROP DEFAULT,
ALTER COLUMN "checked_out_time_utc" SET DATA TYPE TEXT,
ALTER COLUMN "checked_in_time_utc" SET NOT NULL,
ALTER COLUMN "checked_in_time_utc" SET DATA TYPE TEXT;
