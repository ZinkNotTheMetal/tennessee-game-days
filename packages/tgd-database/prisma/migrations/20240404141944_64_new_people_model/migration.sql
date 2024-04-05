/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `people` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `people` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pass_purchased` to the `attendees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `people` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `people` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `people` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PassTypePurchased" AS ENUM ('Free', 'Individual', 'Couple', 'Family');

-- DropIndex
DROP INDEX "people_first_name_last_name_key";

-- AlterTable
ALTER TABLE "attendees" ADD COLUMN     "pass_purchased" "PassTypePurchased" NOT NULL;

-- AlterTable
ALTER TABLE "people" ADD COLUMN     "related_person_id" INTEGER,
ADD COLUMN     "zip_code" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL;

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" SERIAL NOT NULL,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_phone" VARCHAR(20) NOT NULL,
    "emergency_contact_relationship" TEXT NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contacts_person_id_key" ON "emergency_contacts"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "people_phone_number_key" ON "people"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "people_email_key" ON "people"("email");

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_related_person_id_fkey" FOREIGN KEY ("related_person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
