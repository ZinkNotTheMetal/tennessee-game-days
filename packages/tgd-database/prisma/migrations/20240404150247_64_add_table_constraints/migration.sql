/*
  Warnings:

  - A unique constraint covering the columns `[first_name,last_name,related_person_id]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "people" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "zip_code" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "people_first_name_last_name_related_person_id_key" ON "people"("first_name", "last_name", "related_person_id");
