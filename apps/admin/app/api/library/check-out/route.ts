import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";

interface CheckOutRequest {
  libraryId: string
  attendeeId: string
}

export async function POST(request: NextRequest) {
  const data: CheckOutRequest = await request.json()
  if (!data.attendeeId || !data.libraryId) return NextResponse.json({ message: "Request not properly formed" }, { status: 400 })

  const checkedOutTime = DateTime.utc().toISO()

  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: Number(data.libraryId) }
  })

  const attendee = await prisma.attendee.findFirst({
    where: { id: Number(data.attendeeId) }
  })

  const hasGameCheckedOut = await prisma.libraryCheckoutEvent.count({
    where: { attendeeId: Number(data.attendeeId), checkedInTimeUtcIso: null }
  })

  if (libraryItem === null) return NextResponse.json({ message: "Library Item not found" }, { status: 404 })
  if (attendee === null) return NextResponse.json({ message: 'Attendee not found in system'}, { status: 404 })
  if (hasGameCheckedOut !== 0) return NextResponse.json({ message: 'User has game already checked out!'}, { status: 420 })  
  if (libraryItem.isCheckedOut) return NextResponse.json({ message: "Game already checked out!" }, { status: 400 })

  const currentConvention = await prisma.convention.findFirst({
    where: {
      AND: [
        {
          startDateTimeUtc: {
            gte: DateTime.utc().toISO()
          }
        },
        {
          endDateTimeUtc: {
            lte: DateTime.utc().toISO()
          }
        }
      ]
    }
  })

  console.log("convention", currentConvention)

  await prisma.$transaction(async t => {

    await t.libraryItem.update({
      where: { id: Number(data.libraryId)},
      data: {
        isCheckedOut: true
      }
    })

    await t.libraryCheckoutEvent.create({
      data: {
        attendeeId: Number(data.attendeeId),
        checkedOutTimeUtcIso: checkedOutTime,
        libraryCopyId: Number(data.libraryId)
      }
    })

  })

  return NextResponse.json({
    message: 'Successfully checked out!'
    },
    { status: 200 }
  )

}


export async function GET() {
  const count = await prisma.libraryItem.count({
    where: { isCheckedOut: true }
  })
  
  const checkedOutGames = await prisma.libraryItem.findMany({
    where: { isCheckedOut: true },
    include: {
      boardGameGeekThing: true,
      checkOutEvents: {
        orderBy: { 
          checkedOutTimeUtcIso: 'desc'
        },
        include: {
          attendee: {
            include: {
              person: true
            }
          }
        }
      }
    },
  })

  return NextResponse.json({
    total: count,
    list: checkedOutGames,
  });

}