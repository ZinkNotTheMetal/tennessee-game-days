
import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { GetCurrentOrUpcomingConvention, GetNextUpcomingConvention } from "../../convention/upcoming/actions";

/**
 * @swagger
 * /api/play-to-win/log:
 *   get:
 *     tags:
 *       - Play to Win Games
 *     summary: Get upcoming conventions / current conventions Play to Win details
 *     description: Retrieves all details of all Play to Win games
 *     responses:
 *       200:
 *         description: Successfully retrieved Play to Win item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: unique identifier for the play to win item
 *                 barcode:
 *                   type: string
 *                   description: The unique barcode for the play to win
 *                 gameName:
 *                   type: string
 *                   description: The name of the play to win name
 *                 isHidden:
 *                   type: boolean
 *                   description: Flag that states if a game is hidden from users
 *                 publisherName:
 *                   type: string
 *                   description: The name of the publisher
 *                 dateAddedUtc:
 *                   type: string
 *                   format: date-time
 *                 boardGameGeekThing:
 *                   $ref: '#/components/schemas/BoardGameGeekThing'
 *                 _count:
 *                   type: object
 *                   properties:
 *                     playToWinPlays:
 *                       type: number
 *                       description: Amount of plays people have played for this item
 */
export async function GET() {
  const currentOrUpcomingConvention = await GetCurrentOrUpcomingConvention()

  if (currentOrUpcomingConvention === null) {
    return NextResponse.json({ error: "Cannot find the current or next upcoming convention" }, { status: 404 })
  }

  const [playToWinGames, gamesWithAtLeastOnePlay, totalRegisteredPlay, uniqueAttendeesPlayed] = await Promise.all([
    // Total Games
    prisma.playToWinItem.count({
      where: {
        conventionId: currentOrUpcomingConvention.id
      }
    }),
    prisma.playToWinItem.count({
      where: {
        playToWinPlays: {
          some: {}
        },
        conventionId: currentOrUpcomingConvention.id
      }
    }),
    prisma.playToWinPlay.count({
      where: {
        conventionId: currentOrUpcomingConvention.id
      }
    }),
    prisma.playToWinPlayAttendee.findMany({
      distinct: ['attendeeId'],
      where: {
        playToWinPlay: {
          conventionId: currentOrUpcomingConvention.id
        }
      },
      select: {
        attendeeId: true
      }
    })
  ])
  
  revalidateTag('ptw-entry')

  return NextResponse.json({
    totalPlayToWinGames: playToWinGames,
    playToWinGamesPlayed: gamesWithAtLeastOnePlay,
    playToWinPlays: totalRegisteredPlay,
    attendeesPlayed: uniqueAttendeesPlayed.length
  }, { status: 200 })
}