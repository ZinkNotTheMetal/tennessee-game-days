import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const conventionForReport = await prisma.convention.count({
    where: { id: Number(params.conventionId) }
  })

  if (conventionForReport <= 0) return NextResponse.json({ message: "Convention not found" }, { status: 404 })

  const playsAndPlayersPerGame = await prisma.playToWinItem.findMany({
    select: {
      gameName: true,
      publisherName: true,
      playToWinPlays: {
        select: {
          id: true,
          playToWinPlayAttendees: true,
        }
      },
      boardGameGeekThing: {
        select: {
          averageUserRating: true,
          complexityRating: true,
        }
      }
    },
    orderBy: {
      publisherName: 'asc',
    }
  })

  const result = playsAndPlayersPerGame.map((game) => ({
    gameName: game.gameName,
    publisher: game.publisherName,
    plays: game.playToWinPlays.length,
    totalPlayers: game.playToWinPlays.reduce(
      (total, play) => total + play.playToWinPlayAttendees.length,
      0
    ),
    bggUserRating: game.boardGameGeekThing?.averageUserRating,
    bggComplexityRating: game.boardGameGeekThing?.complexityRating
  }));

  return NextResponse.json(result)

}
