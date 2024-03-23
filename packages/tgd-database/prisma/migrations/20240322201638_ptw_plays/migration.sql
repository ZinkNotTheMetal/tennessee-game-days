/*
  Warnings:

  - You are about to drop the `play_to_win_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "play_to_win_events" DROP CONSTRAINT "play_to_win_events_attendee_id_fkey";

-- DropForeignKey
ALTER TABLE "play_to_win_events" DROP CONSTRAINT "play_to_win_events_play_to_win_item_id_fkey";

-- DropTable
DROP TABLE "play_to_win_events";

-- CreateTable
CREATE TABLE "play_to_win_plays" (
    "id" TEXT NOT NULL,
    "play_to_win_item_id" INTEGER NOT NULL,
    "checked_in_time_utc" TEXT NOT NULL,

    CONSTRAINT "play_to_win_plays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_to_win_play_players" (
    "id" TEXT NOT NULL,
    "play_to_win_play_id" TEXT NOT NULL,
    "attendee_id" INTEGER NOT NULL,

    CONSTRAINT "play_to_win_play_players_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "play_to_win_plays" ADD CONSTRAINT "play_to_win_plays_play_to_win_item_id_fkey" FOREIGN KEY ("play_to_win_item_id") REFERENCES "play_to_win_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_play_players" ADD CONSTRAINT "play_to_win_play_players_play_to_win_play_id_fkey" FOREIGN KEY ("play_to_win_play_id") REFERENCES "play_to_win_plays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_play_players" ADD CONSTRAINT "play_to_win_play_players_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
