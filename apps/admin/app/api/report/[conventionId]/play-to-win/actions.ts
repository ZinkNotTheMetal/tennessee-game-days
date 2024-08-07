import prisma from "@/app/lib/prisma"

export async function GetPlayToWinReportByConvention(conventionId: number) {
  const conventionForReport = await prisma.convention.findUnique({
    where: { id: conventionId }
  })

  if (conventionForReport === null) return null

  const playsAndPlayersPerGame = await prisma.playToWinItem.findMany({
    where: { conventionId: conventionId },
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
      publisherName: 'asc'
    }
  })

  const result = playsAndPlayersPerGame.map((game) => ({
    gameName: game.gameName,
    publisher: game.publisherName,
    totalPlays: game.playToWinPlays.length,
    totalPlayerCount: game.playToWinPlays.reduce(
      (total, play) => total + play.playToWinPlayAttendees.length,
      0
    ),
    bggUserRating: game.boardGameGeekThing?.averageUserRating,
    bggComplexityRating: game.boardGameGeekThing?.complexityRating
  }))

  return result
}