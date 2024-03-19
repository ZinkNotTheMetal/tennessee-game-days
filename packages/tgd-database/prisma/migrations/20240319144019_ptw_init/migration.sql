/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `play_to_win_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode` to the `play_to_win_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "play_to_win_items" DROP CONSTRAINT "play_to_win_items_bgg_id_fkey";

-- AlterTable
ALTER TABLE "play_to_win_items" ADD COLUMN     "barcode" TEXT NOT NULL,
ADD COLUMN     "total_played" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "bgg_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "play_to_win_items_barcode_key" ON "play_to_win_items"("barcode");

-- AddForeignKey
ALTER TABLE "play_to_win_items" ADD CONSTRAINT "play_to_win_items_bgg_id_fkey" FOREIGN KEY ("bgg_id") REFERENCES "board_game_geek_items"("bgg_id") ON DELETE SET NULL ON UPDATE CASCADE;
