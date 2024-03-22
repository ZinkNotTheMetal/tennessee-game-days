-- AlterTable
ALTER TABLE "attendees" ADD COLUMN     "is_organizer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_volunteer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "play_to_win_events" (
    "id" TEXT NOT NULL,
    "play_to_win_item_id" INTEGER NOT NULL,
    "attendee_id" INTEGER NOT NULL,
    "checked_in_time_utc" TEXT NOT NULL,

    CONSTRAINT "play_to_win_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "play_to_win_events" ADD CONSTRAINT "play_to_win_events_play_to_win_item_id_fkey" FOREIGN KEY ("play_to_win_item_id") REFERENCES "play_to_win_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_events" ADD CONSTRAINT "play_to_win_events_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
