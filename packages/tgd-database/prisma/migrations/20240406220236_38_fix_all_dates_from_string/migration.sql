/*
  Warnings:

  - The `checked_in_utc` column on the `attendees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checked_out_time_utc` column on the `conventions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `registered_date_utc` on the `attendees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_added_utc` on the `library_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_updated_utc` on the `library_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date_added_utc` on the `play_to_win_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `checked_in_time_utc` on the `play_to_win_plays` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "attendees" DROP COLUMN "checked_in_utc",
ADD COLUMN     "checked_in_utc" TIMESTAMPTZ,
DROP COLUMN "registered_date_utc",
ADD COLUMN     "registered_date_utc" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "conventions" DROP COLUMN "checked_out_time_utc",
ADD COLUMN     "checked_out_time_utc" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "library_items" DROP COLUMN "date_added_utc",
ADD COLUMN     "date_added_utc" TIMESTAMPTZ NOT NULL,
DROP COLUMN "date_updated_utc",
ADD COLUMN     "date_updated_utc" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "people" ADD COLUMN     "date_added_utc" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "play_to_win_items" DROP COLUMN "date_added_utc",
ADD COLUMN     "date_added_utc" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "play_to_win_plays" DROP COLUMN "checked_in_time_utc",
ADD COLUMN     "checked_in_time_utc" TIMESTAMPTZ NOT NULL;
