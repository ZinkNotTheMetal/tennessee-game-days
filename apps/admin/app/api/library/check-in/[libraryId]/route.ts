import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { DateTime } from "ts-luxon"

export async function PUT(request: NextRequest, { params }: { params: { libraryId: string } }) {
  const checkedInTime = DateTime.utc()

  const libraryItem = await prisma.libraryItem.count({
    where: { id: Number(params.libraryId) }
  })

  if (libraryItem === null) return NextResponse.json({ message: "Library Item not found" }, { status: 404 })

  await prisma.$transaction(async t => {

    const result = await t.libraryCheckoutEvent.findFirst({
      where: { libraryCopyId: Number(params.libraryId), checkedInTimeUtcIso: null }
    })

    // If there are no current check out events then it will just return the 200
    // If we need a force function I can build that quickly just to do lines 33 without incrementing minutes
    if (result === null) return

    const event = await t.libraryCheckoutEvent.update({
      where: { id: result.id, checkedInTimeUtcIso: null },
      data: { 
        checkedInTimeUtcIso: checkedInTime.toUTC().toISO()
      }
    })

    if (event === null) return

    await t.libraryItem.update({
      where: 
      { id: Number(params.libraryId) },
      data: {
        isCheckedOut: false,
        totalCheckedOutMinutes: {
          increment: Number(checkedInTime.diff(DateTime.fromISO(result.checkedOutTimeUtcIso), 'minutes').toObject().minutes?.toFixed(0))
        }
      }
    })

  })


  return NextResponse.json({
    message: 'Successfully checked in!'
    },
    { status: 200 }
  )
}

