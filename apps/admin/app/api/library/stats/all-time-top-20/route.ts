import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Top20LibraryListResponse } from "./response";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * @swagger
 * tags:
 *   - name: Attendee
 *     description: Operations related to attendees
 *   - name: Barcode
 *     description: Operations related to barcode scanning
 *   - name: Convention
 *     description: Operations related to conventions
 *   - name: Library
 *     description: Operations related to library items
 *   - name: Play to Win Games
 *     description: Operations related to play to win items within a convention
 *   - name: Venue
 *     description: Operations related to Venues for conventions
 *   - name: Reports
 *     description: Reporting related endpoints
 */
interface Top20CheckedOutGameDto {
  library_item_id: string
  bgg_id: string
  total_checkout_minutes: bigint
  total_checkout_events: number
  library_item_name: string
  bgg_average_rating: number
  bgg_average_complexity: number
  playing_time_min: number
  min_player_count: number
  max_player_count: number
  voted_best_player_count: number
  all_copies_checked_out: boolean
}

/**
 * @swagger
 *   /api/library/stats/all-time-top-20:
 *   get:
 *     tags:
 *       - Library
 *     summary: Top 20 library games checked out Returns list of all library games
 *     description: Retrieves a list of library games that have been checked out in all conventions
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Top20LibraryItemResult'
 */
export async function GET() {

  //https://github.com/prisma/prisma/discussions/16255
  // Only option for nested group by is to use raw query
  const top20CheckedOutGames: Top20CheckedOutGameDto[] = await prisma.$queryRaw`
    SELECT
    e.library_item_id AS library_item_id,
    l.bgg_id,
    SUM(l.minutes_checked_out) AS total_checkout_minutes,
    COUNT(*) AS total_checkout_events,
    COALESCE(l.alias, b.bgg_item_name) AS library_item_name,
    b.bgg_average_rating as bgg_average_rating,
    b.bgg_weight_rating as bgg_average_complexity,
    COUNT(*) = SUM(CASE WHEN l.is_checked_out = true THEN 1 ELSE 0 END) AS all_copies_checked_out,
    b.playing_time_min,
    b.min_player_count,
    b.max_player_count,
    b.best_player_count AS voted_best_player_count
    FROM public.library_checkout_events AS e
    INNER JOIN public.library_items AS l ON l.id = e.library_item_id
    INNER JOIN public.board_game_geek_items as b ON b.bgg_id = l.bgg_id
    GROUP BY library_item_id, l.bgg_id, library_item_name, b.bgg_average_rating, b.bgg_weight_rating, b.playing_time_min, b.min_player_count, b.max_player_count, voted_best_player_count
    ORDER BY total_checkout_minutes DESC
    LIMIT 20
  `

  // Convert BigInt values to strings
  const formattedData = top20CheckedOutGames.map(entry => ({
    id: entry.library_item_id,
    bggId: entry.bgg_id,
    libraryItemName: entry.library_item_name,
    allCopiesCheckedOut: entry.all_copies_checked_out,
    totalCheckedOutMinutes: entry.total_checkout_minutes.toString(),
    totalCheckedOutEvents: entry.total_checkout_events.toString(),
    bggAverageRating: entry.bgg_average_rating,
    bggAverageComplexity: entry.bgg_average_complexity,
    minPlayerCount: entry.min_player_count,
    maxPlayerCount: entry.max_player_count,
    votedBestPlayerCount: entry.voted_best_player_count,
    bggPlaytimeMinutes: entry.playing_time_min
  }));

  return NextResponse.json<Top20LibraryListResponse>({
    list: formattedData,
  }, { status: 200 })
}