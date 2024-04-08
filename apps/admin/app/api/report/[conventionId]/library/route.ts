import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { DateTime } from "ts-luxon";

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const conventionForReport = await prisma.convention.findFirst({
    where: { id: Number(params.conventionId) }
  })

  if (conventionForReport === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })
  if (!conventionForReport.startDateTimeUtc) return NextResponse.json({ message: "Convention start date was not found" }, { status: 522 })
  if (!conventionForReport.endDateTimeUtc) return NextResponse.json({ message: "Convention end date was not found" }, { status: 522 })


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

  return NextResponse.json({ 
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
}, { status: 200 });

}