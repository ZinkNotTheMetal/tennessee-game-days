-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('Attendee', 'LibraryItem', 'PlayToWinItem');

-- CreateTable
CREATE TABLE "centralized_barcodes" (
    "id" SERIAL NOT NULL,
    "barcode" TEXT NOT NULL,
    "entity_type" "EntityType" NOT NULL,
    "entity_id" INTEGER NOT NULL,

    CONSTRAINT "centralized_barcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conventions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date_utc" TIMESTAMP(3),
    "end_date_utc" TIMESTAMP(3),
    "date_updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_cancelled" BOOLEAN NOT NULL DEFAULT false,
    "venue_id" INTEGER,

    CONSTRAINT "conventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "street_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state_province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_game_geek_items" (
    "bgg_id" INTEGER NOT NULL,
    "bgg_item_name" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "full_image_url" TEXT,
    "year_published" INTEGER,
    "playing_time_min" INTEGER,
    "min_player_count" INTEGER,
    "max_player_count" INTEGER,
    "min_player_age" INTEGER,
    "bgg_game_ranking" INTEGER,
    "best_player_count" INTEGER,
    "bgg_average_rating" DECIMAL(5,3),
    "bgg_weight_rating" DECIMAL(5,3),

    CONSTRAINT "board_game_geek_items_pkey" PRIMARY KEY ("bgg_id")
);

-- CreateTable
CREATE TABLE "bgg_mechanics" (
    "bgg_mechanic_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "bgg_mechanics_pkey" PRIMARY KEY ("bgg_mechanic_id")
);

-- CreateTable
CREATE TABLE "game_mechanics" (
    "bgg_id" INTEGER NOT NULL,
    "bgg_mechanic_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "library_items" (
    "id" SERIAL NOT NULL,
    "bgg_thing_id" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "alias" TEXT,
    "owner" TEXT NOT NULL,
    "is_hidden" BOOLEAN NOT NULL,
    "is_checked_out" BOOLEAN NOT NULL,
    "minutes_checked_out" INTEGER NOT NULL DEFAULT 0,
    "date_added_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_item_contents" (
    "library_item_id" INTEGER NOT NULL,
    "game_item_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_to_win_items" (
    "id" SERIAL NOT NULL,
    "bgg_thing_id" INTEGER NOT NULL,
    "game_name" TEXT,
    "convention_id" INTEGER NOT NULL,
    "is_hidden" BOOLEAN NOT NULL,

    CONSTRAINT "play_to_win_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "library_checkout_events" (
    "id" TEXT NOT NULL,
    "libary_game_barcode_scanned" INTEGER NOT NULL,
    "library_item_id" INTEGER NOT NULL,
    "checkout_attendee_id" INTEGER NOT NULL,
    "checked_out_time_utc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked_in_time_utc" TIMESTAMP(3),

    CONSTRAINT "library_checkout_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "is_checked_in" BOOLEAN NOT NULL DEFAULT false,
    "checked_in_utc" TIMESTAMP(3),

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "centralized_barcodes_barcode_key" ON "centralized_barcodes"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "centralized_barcodes_entity_type_entity_id_key" ON "centralized_barcodes"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "conventions_name_key" ON "conventions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "venues_name_key" ON "venues"("name");

-- CreateIndex
CREATE UNIQUE INDEX "board_game_geek_items_bgg_id_key" ON "board_game_geek_items"("bgg_id");

-- CreateIndex
CREATE UNIQUE INDEX "bgg_mechanics_name_key" ON "bgg_mechanics"("name");

-- CreateIndex
CREATE INDEX "game_mechanics_bgg_id_bgg_mechanic_id_idx" ON "game_mechanics"("bgg_id", "bgg_mechanic_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_mechanics_bgg_id_bgg_mechanic_id_key" ON "game_mechanics"("bgg_id", "bgg_mechanic_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_items_barcode_key" ON "library_items"("barcode");

-- CreateIndex
CREATE INDEX "library_item_contents_library_item_id_game_item_id_idx" ON "library_item_contents"("library_item_id", "game_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_item_contents_library_item_id_game_item_id_key" ON "library_item_contents"("library_item_id", "game_item_id");

-- AddForeignKey
ALTER TABLE "conventions" ADD CONSTRAINT "conventions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_mechanics" ADD CONSTRAINT "game_mechanics_bgg_id_fkey" FOREIGN KEY ("bgg_id") REFERENCES "board_game_geek_items"("bgg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_mechanics" ADD CONSTRAINT "game_mechanics_bgg_mechanic_id_fkey" FOREIGN KEY ("bgg_mechanic_id") REFERENCES "bgg_mechanics"("bgg_mechanic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_bgg_thing_id_fkey" FOREIGN KEY ("bgg_thing_id") REFERENCES "board_game_geek_items"("bgg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_item_contents" ADD CONSTRAINT "library_item_contents_library_item_id_fkey" FOREIGN KEY ("library_item_id") REFERENCES "library_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_item_contents" ADD CONSTRAINT "library_item_contents_game_item_id_fkey" FOREIGN KEY ("game_item_id") REFERENCES "board_game_geek_items"("bgg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_items" ADD CONSTRAINT "play_to_win_items_bgg_thing_id_fkey" FOREIGN KEY ("bgg_thing_id") REFERENCES "board_game_geek_items"("bgg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_to_win_items" ADD CONSTRAINT "play_to_win_items_convention_id_fkey" FOREIGN KEY ("convention_id") REFERENCES "conventions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_checkout_events" ADD CONSTRAINT "library_checkout_events_library_item_id_fkey" FOREIGN KEY ("library_item_id") REFERENCES "library_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_checkout_events" ADD CONSTRAINT "library_checkout_events_checkout_attendee_id_fkey" FOREIGN KEY ("checkout_attendee_id") REFERENCES "attendees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
