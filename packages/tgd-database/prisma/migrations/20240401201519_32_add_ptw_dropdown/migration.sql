/*
  Warnings:

  - Added the required column `convention_id` to the `play_to_win_plays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "play_to_win_plays" ADD COLUMN     "convention_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "play_to_win_plays" ADD CONSTRAINT "play_to_win_plays_convention_id_fkey" FOREIGN KEY ("convention_id") REFERENCES "conventions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
