import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { MapToBoardGameEntity, SearchBoardGameGeek } from "@repo/board-game-geek-shared";
import { DateTime } from "ts-luxon";
import { Sleep, UpsertBoardGameGeekMechanics } from "./actions";


// WZ: Cannot run this on Vercel due to the timeout limitations
// I can run this locally and update the database to production
// Uncomment below locally if needed
//export const maxDuration = 300

/**
 * @swagger
 * /api/play-to-win/bgg/update:
 *   post:
 *     tags:
 *       - Play to Win Games
 *     summary: Update Play to Win items with BoardGameGeek information
 *     description: Fetches the next upcoming convention and updates Play to Win items with information from BoardGameGeek.
 *     responses:
 *       200:
 *         description: Successfully updated play to win items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the play to win items were updated
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating why the request failed
 *       516:
 *         description: No upcoming convention found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating no upcoming convention was found
 */
export async function POST(request: NextRequest) {

  try {

    const nextUpcomingConvention = await prisma.convention.findFirst({
      where: {
        endDateTimeUtc: {
          gt: DateTime.utc().toISO()
        }
      },
      include: {
        venue: true
      },
      orderBy: {
        startDateTimeUtc: 'asc'
      }
    })
  
    if (nextUpcomingConvention === null) {
      return NextResponse.json({ error: "Cannot log play to win as there are no conventions to log this play against" }, { status: 516 })
    }

    const playToWinItemsInSystem = await prisma.playToWinItem.findMany({
      where: { conventionId: nextUpcomingConvention.id }
    })

    for(const ptwItem of playToWinItemsInSystem) {
      if (!ptwItem.gameName) continue
      const bggResults = await SearchBoardGameGeek(ptwItem.gameName, false)

      if (bggResults && bggResults.totalCount > 0) {

        // Sometimes the query is weird and gives back other games where the name doesn't exactly match
        const found = bggResults.results.find((result) => result.name === ptwItem.gameName)

        if (found) {
          const { mechanics, ...bggGame } = MapToBoardGameEntity(found)
          
          // Add the bgg item
          await prisma.boardGameGeekThing.upsert({
            where: { id: bggGame.id },
            update: bggGame,
            create: bggGame,
          });

          // Add mechanics
          await UpsertBoardGameGeekMechanics(bggGame.id, mechanics)

          // Update PTW item with bggId
          await prisma.playToWinItem.update({
            where: { id: ptwItem.id },
            data: {
              boardGameGeekId: bggGame.id
            }
          })

        } else {
          console.log("Could not properly match BGG Item", ptwItem.gameName, bggResults.totalCount)
          continue
        }

      } else {
        // No results at all from BGG
        console.log("No results from BGG:", ptwItem.gameName)
        continue
      }

      await Sleep(1900)
    }


  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: error
    }, { status: 500})
  }

  return NextResponse.json({
    message: 'Successfully updated play to win items'
  }, { status: 200 })
}