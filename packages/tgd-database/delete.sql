-- Script used to delete the database without running the reseed command
TRUNCATE TABLE public.attendees CASCADE;
ALTER SEQUENCE attendees_id_seq RESTART WITH 1;

TRUNCATE TABLE public.play_to_win_items CASCADE;
ALTER SEQUENCE play_to_win_items_id_seq RESTART WITH 1;

TRUNCATE TABLE public.people CASCADE;
ALTER SEQUENCE people_id_seq RESTART WITH 100;

TRUNCATE TABLE public.play_to_win_play_players CASCADE;
TRUNCATE TABLE public.play_to_win_plays CASCADE;

TRUNCATE TABLE public.library_checkout_events CASCADE;
ALTER SEQUENCE library_checkout_events_id_seq RESTART WITH 1;

UPDATE public.library_items
SET is_checked_out = false;

DELETE FROM public.centralized_barcodes
WHERE id > 463;

ALTER SEQUENCE centralized_barcodes_id_seq RESTART WITH 463;