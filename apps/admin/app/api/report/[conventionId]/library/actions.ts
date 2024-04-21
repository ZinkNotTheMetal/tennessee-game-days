import prisma from "@/app/lib/prisma"
import { DateTime } from "ts-luxon"

export async function GetLibraryPlaytimeCounts(conventionId: number) {
  const conventionForReport = await prisma.convention.findUnique({
    where: { id: conventionId }
  })
  
  if (conventionForReport === null) return null
  if (!conventionForReport.startDateTimeUtc) return null
  if (!conventionForReport.endDateTimeUtc) return null

  const [gameCheckouts, gamesNotCheckedOut] = await Promise.all([
    prisma.libraryItem.findMany({
      where: {
        AND: [
          { 
            checkOutEvents: {
              some: {
                checkedInTimeUtcIso: { lte: conventionForReport.endDateTimeUtc, not: null }
              }
            }
          },
          {
            checkOutEvents: {
              some: {
                checkedOutTimeUtcIso: { gte: conventionForReport.startDateTimeUtc }
              }
            }
          }
        ]
      },
      select: {
        _count: {
          select: {
            checkOutEvents: true
          }
        },
        checkOutEvents: {
          select: {
            checkedOutTimeUtcIso: true,
            checkedInTimeUtcIso: true,
          }
        },
        totalCheckedOutMinutes: true,
        alias: true,
        owner: true,
        barcode: true,
        boardGameGeekThing: {
          select: {
            itemName: true
          }
        }
      },
      orderBy: {
        checkOutEvents: {
          _count: 'desc'
        }
      }
    }),
    prisma.libraryItem.findMany({
      where: {
        NOT: {
          AND: [
            { 
              checkOutEvents: {
                some: {
                  checkedInTimeUtcIso: { lte: conventionForReport.endDateTimeUtc, not: null }
                }
              }
            },
            {
              checkOutEvents: {
                some: {
                  checkedOutTimeUtcIso: { gte: conventionForReport.startDateTimeUtc }
                }
              }
            }
          ]
        }
      },
      select: {
        totalCheckedOutMinutes: true,
        alias: true,
        owner: true,
        barcode: true,
        boardGameGeekThing: {
          select: {
            itemName: true
          }
        }
      },
    })
  ])

  return {
    itemsPlayed: gameCheckouts.map(item => ({
      barcode: item.barcode,
      owner: item.owner,
      timesCheckedOut: item._count.checkOutEvents,
      name: item.alias ?? item.boardGameGeekThing?.itemName,
      totalTimeCheckedOut: item.totalCheckedOutMinutes,
      conferenceTimeCheckedOut: Number(item.checkOutEvents.reduce((acc, current) => {
        if (current.checkedInTimeUtcIso === null) return acc
        const minutesCheckedOut = DateTime.fromJSDate(current.checkedInTimeUtcIso).diff(DateTime.fromJSDate(current.checkedOutTimeUtcIso), 'minutes').minutes
        return acc + minutesCheckedOut
      }, 0).toFixed(0))
    })),

    itemsNotPlayed: gamesNotCheckedOut.map(item => ({
      barcode: item.barcode,
      owner: item.owner,
      totalCheckedOutMinutes: item.totalCheckedOutMinutes,
      name: item.alias ?? item.boardGameGeekThing?.itemName
    })).sort((a, b) => a.name.localeCompare(b.name))
  }
}

