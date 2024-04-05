/*
  Warnings:

  - You are about to drop the `emergency_contacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_person_id_fkey";

-- AlterTable
ALTER TABLE "people" ADD COLUMN     "emergency_contact_name" TEXT,
ADD COLUMN     "emergency_contact_phone" TEXT,
ADD COLUMN     "emergency_contact_relationship" TEXT;

-- DropTable
DROP TABLE "emergency_contacts";
