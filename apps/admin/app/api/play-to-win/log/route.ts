import prisma from "@/app/lib/prisma";
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

  // TODO: @WZ - Fix this to be during convention
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

  return NextResponse.json({
    message: 'Successfully logged Play to Win Play'
  }, { status: 200 })

}

export async function GET() {
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

  const playToWinPlays = await prisma.playToWinPlay.count({
    where: { conventionId: nextUpcomingConvention.id}
  })

  return NextResponse.json({
    count: playToWinPlays
  }, { status: 200 })
}