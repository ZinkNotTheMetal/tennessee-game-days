import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface Top20CheckedOutGameDto {
  bgg_id: string
  total_checkout_minutes: bigint
  total_checkout_events: number
  library_item_name: string
  bgg_average_rating: number
  bgg_average_complexity: number
  playing_time_min: number
  min_player_count: number
  max_player_count: number
  all_copies_checked_out: boolean
}

export async function GET() {

  //https://github.com/prisma/prisma/discussions/16255
  // Only option for nested group by is to use raw query

  const top20CheckedOutGames: Top20CheckedOutGameDto[] = await prisma.$queryRaw`
    SELECT
    l.bgg_id,
    SUM(l.minutes_checked_out) AS total_checkout_minutes,
    COUNT(*) AS total_checkout_events,
    COALESCE(l.alias, b.bgg_item_name) AS library_item_name,
    b.bgg_average_rating as bgg_average_rating,
    b.bgg_weight_rating as bgg_average_complexity,
    COUNT(*) = SUM(CASE WHEN l.is_checked_out = true THEN 1 ELSE 0 END) AS all_copies_checked_out,
    b.playing_time_min,
    b.min_player_count,
    b.max_player_count
    FROM public.library_checkout_events AS e
    INNER JOIN public.library_items AS l ON l.id = e.library_item_id
    INNER JOIN public.board_game_geek_items as b ON b.bgg_id = l.bgg_id
    GROUP BY l.bgg_id, library_item_name, b.bgg_average_rating, b.bgg_weight_rating, b.playing_time_min, b.min_player_count, b.max_player_count
    ORDER BY total_checkout_minutes DESC
    LIMIT 20
  `

  // Convert BigInt values to strings
  const formattedData = top20CheckedOutGames.map(entry => ({
    bggId: entry.bgg_id,
    libraryItemName: entry.library_item_name,
    allCopiesCheckedOut: entry.all_copies_checked_out,
    totalCheckedOutMinutes: entry.total_checkout_minutes.toString(),
    totalCheckedOutEvents: entry.total_checkout_events.toString(),
    bggAverageRating: entry.bgg_average_rating,
    bggAverageComplexity: entry.bgg_average_complexity,
    minPlayerCount: entry.min_player_count,
    maxPlayerCount: entry.max_player_count,
    bggPlaytimeMinutes: entry.playing_time_min
  }));

  return NextResponse.json({
    list: formattedData,
  }, { status: 200 })
}