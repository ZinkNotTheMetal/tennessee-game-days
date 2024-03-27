/*
  Warnings:

  - A unique constraint covering the columns `[first_name,last_name]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "attendees" ADD COLUMN     "has_cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "staying_at_convention" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "people_first_name_last_name_key" ON "people"("first_name", "last_name");
