/*
Mythic Mischief Vol 2,400617,524030-TGD-00

Terraforming Mars Dice Game,296108,824021-GP-00
--
*/

-- 1. Insert a blank barcode record
INSERT INTO public.centralized_barcodes (barcode,entity_type,entity_id)
VALUES
('524030-TGD-00', 'LibraryItem', 0),
('824021-GP-00', 'LibraryItem', 0),
;

-- Send the above query
SELECT * FROM public.centralized_barcodes
WHERE barcode = '524028-TGD-00'
SELECT * FROM public.library_items 
INNER JOIN public.board_game_geek_items ON public.board_game_geek_items.bgg_id = public.library_items.bgg_id
where barcode = '524028-TGD-00'

-- 2. Use the API to get the details of each game and add it
-- 2a) Add bgg_mechanics that are missing

SELECT * FROM
public.bgg_mechanics
WHERE bgg_mechanic_id IN (2001, 2676, 2015)

-- Double check that the game isn't already added
SELECT * FROM public.board_game_geek_items
WHERE bgg_id IN (400617)

-- 2b) Add into board_game_geek_items
INSERT INTO board_game_geek_items (bgg_id, bgg_item_name, item_type, description, thumbnail_url, full_image_url, year_published, playing_time_min, min_player_count, max_player_count, min_player_age, bgg_game_ranking, best_player_count, bgg_average_rating, bgg_weight_rating, publisher)
VALUES
(400617, 'Mythic Mischief Vol. II', 'boardgame', 'In the standalone sequel to Mythic Mischief, you play as a faction of Mythic Manor students competing to get as many of the other students caught by the Groundskeeper as you can without getting caught yourself.\nThe Gargoyles, Gnomes, Werewolves, and Fairies each have their own unique set of abilities to move around the board, move the other factions into the path of the Groundskeeper, and even alter the course of the Groundskeeper by moving hedge walls.\nPlayers are able to upgrade their Faction’s abilities throughout the game by collecting powerful Tomes from around the hedge maze.\nThe winner is the first Team to score 10 Mischief Points or the Team with the most points when the Groundskeeper finishes returning all of the Tomes after lunch!\n\n—description from the publisher\n\n', 'https://cf.geekdo-images.com/l_9vmWRPz55Wm_NXg9_tmg__thumb/img/SzAC3_XFKbHJzTtcYA8f-cytbVU=/fit-in/200x150/filters:strip_icc()/pic7719665.png', 'https://cf.geekdo-images.com/l_9vmWRPz55Wm_NXg9_tmg__original/img/B1xP5eGIObV_3Pu7HIFfvSQY1PY=/0x0/filters:format(png)/pic7719665.png', 2024, 90, 1, 4, 14, 11075, 2, 7.998, 0, 'IV Studio (IV Games)')

-- 2c) Map game mechanics back to the board game
INSERT INTO public.game_mechanics (bgg_id, bgg_mechanic_id)
VALUES
(400617, 2001),
(400617, 2676),
(400617, 2015)

-- 2d) Add to library item (get the ID)
-- SELECT * FROM public.library_items WHERE bgg_id = 296108
INSERT INTO public.library_items (bgg_id, barcode, alias, owner, is_hidden, is_checked_out, minutes_checked_out, date_added_utc, date_updated_utc)
VALUES
(400617, '524030-TGD-00', null, 'Library', false, false, 0, '2024-10-27 21:18:03.796+00', '2024-10-27 21:18:03.796+00')

-- 3) Update the entity id
UPDATE public.centralized_barcodes
SET entity_id = (SELECT id FROM public.library_items WHERE barcode = '524030-TGD-00')
WHERE barcode = '524030-TGD-00'
;

