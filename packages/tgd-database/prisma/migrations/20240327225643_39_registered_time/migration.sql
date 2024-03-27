/*
  Warnings:

  - Added the required column `registered_date_utc` to the `attendees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendees" ADD COLUMN     "registered_date_utc" TEXT NOT NULL;
