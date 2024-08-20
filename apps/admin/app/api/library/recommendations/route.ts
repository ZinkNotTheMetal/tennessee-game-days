import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

/* TODO: Document this */
export async function GET() {

  const highestRatedGames = await Promise.all([1, 2, 3, 4, 5].map(async (playerCount) => {
    return prisma.libraryItem.findFirst({
      where: {
        boardGameGeekThing: {
          votedBestPlayerCount: playerCount
        }
      },
      orderBy: {
        boardGameGeekThing: {
          ranking: 'asc'  // Assuming 'ranking' is the field you want to use for the highest-rated (lowest rank)
        }
      },
      include: {
        boardGameGeekThing: true
      }
    })
  }))

  return NextResponse.json({
    highestRatedGames
  }, { status: 200})

}