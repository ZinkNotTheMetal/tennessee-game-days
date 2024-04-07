/*
  Warnings:

  - You are about to drop the column `extra_hours_start_date_time_iso_utc` on the `conventions` table. All the data in the column will be lost.
  - The `start_date_time_iso_utc` column on the `conventions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_date_time_iso_utc` column on the `conventions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checked_in_time_utc` column on the `library_checkout_events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `checked_out_time_utc` on the `library_checkout_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "conventions" DROP COLUMN "extra_hours_start_date_time_iso_utc",
ADD COLUMN     "checked_out_time_utc" TEXT,
DROP COLUMN "start_date_time_iso_utc",
ADD COLUMN     "start_date_time_iso_utc" TIMESTAMPTZ,
DROP COLUMN "end_date_time_iso_utc",
ADD COLUMN     "end_date_time_iso_utc" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "library_checkout_events" DROP COLUMN "checked_out_time_utc",
ADD COLUMN     "checked_out_time_utc" TIMESTAMPTZ NOT NULL,
DROP COLUMN "checked_in_time_utc",
ADD COLUMN     "checked_in_time_utc" TIMESTAMPTZ;
