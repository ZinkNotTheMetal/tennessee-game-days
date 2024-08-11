import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";

interface PlayToWinLogRequest {
  playToWinItemId: number
  attendeeIds: number[]
}

export async function POST(request: NextRequest) {
  const data: PlayToWinLogRequest = await request.json()
  const loggedTime = DateTime.utc().toISO()

  if (data === undefined) return NextResponse.json({ error: 'Request is not correct, please verify your request'}, { status: 400 })
  if (data.attendeeIds === undefined || data.attendeeIds.length <= 0) return NextResponse.json({ error: 'No attendee Ids were linked and could not add the PTW play'}, { status: 400 })


  const nextUpcomingConvention = await prisma.convention.findFirst({
    where: {
      OR: [
        {
          startDateTimeUtc: {
            lte: DateTime.utc().toISO() // Convention is ongoing
          },
          endDateTimeUtc: {
            gt: DateTime.utc().toISO()
          }
        },
        {
          startDateTimeUtc: {
            gt: DateTime.utc().toISO() // Convention has not started yet
          }
        }
      ]
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

  const createManyData = data.attendeeIds.map(attendeeId => ({ attendeeId }))

  await prisma.playToWinPlay.create({
    data: {
      conventionId: nextUpcomingConvention.id,
      checkedInTimeUtcIso: loggedTime,
      playToWinItemId: data.playToWinItemId,
      playToWinPlayAttendees: {
        createMany: {
          data: createManyData
        }
      }
    }
  })

  revalidateTag('scanner')

  return NextResponse.json({
    message: 'Successfully logged Play to Win Play'
  }, { status: 200 })

}

/* TODO: Document this */
export async function GET() {
  const nextUpcomingConvention = await prisma.convention.findFirst({
    where: {
      startDateTimeUtc: {
        not: null
      },
      endDateTimeUtc: {
        not: null,
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

  const playToWinPlays = await prisma.playToWinPlay.count({
    where: { conventionId: nextUpcomingConvention.id}
  })

  return NextResponse.json({
    count: playToWinPlays
  }, { status: 200 })
}