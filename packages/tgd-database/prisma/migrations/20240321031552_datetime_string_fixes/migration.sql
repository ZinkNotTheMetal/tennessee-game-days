-- AlterTable
ALTER TABLE "attendees" ALTER COLUMN "checked_in_utc" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "conventions" ALTER COLUMN "start_date_time_iso_utc" SET DATA TYPE TEXT,
ALTER COLUMN "end_date_time_iso_utc" SET DATA TYPE TEXT,
ALTER COLUMN "date_updated_utc" DROP DEFAULT,
ALTER COLUMN "date_updated_utc" SET DATA TYPE TEXT,
ALTER COLUMN "extra_hours_start_date_time_iso_utc" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "library_items" ALTER COLUMN "date_added_utc" DROP DEFAULT,
ALTER COLUMN "date_added_utc" SET DATA TYPE TEXT,
ALTER COLUMN "date_updated_utc" DROP DEFAULT,
ALTER COLUMN "date_updated_utc" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "play_to_win_items" ALTER COLUMN "date_added_utc" DROP DEFAULT,
ALTER COLUMN "date_added_utc" SET DATA TYPE TEXT;
