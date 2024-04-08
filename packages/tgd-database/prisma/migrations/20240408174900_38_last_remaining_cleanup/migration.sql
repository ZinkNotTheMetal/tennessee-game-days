/*
  Warnings:

  - You are about to drop the column `convention_id` on the `library_checkout_events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "library_checkout_events" DROP CONSTRAINT "library_checkout_events_convention_id_fkey";

-- AlterTable
ALTER TABLE "library_checkout_events" DROP COLUMN "convention_id";
