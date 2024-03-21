import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { DateTime } from "ts-luxon"

export async function PUT(request: NextRequest, { params }: { params: { libraryId: string } }) {
  const checkedInTime = DateTime.utc()

  const libraryItem = prisma.libraryItem.count({
    where: { id: Number(params.libraryId) }
  })

  if (libraryItem === null) return NextResponse.json({ message: "Library Item not found" }, { status: 404 })

  await prisma.$transaction(async t => {

    const result = await t.libraryCheckoutEvent.findFirst({
      where: { libraryCopyId: Number(params.libraryId) }
    })

    if (result === null) return

    await t.libraryCheckoutEvent.update({
      where: { id: result.id, checkedInTimeUtcIso: undefined },
      data: { 
        checkedInTimeUtcIso: checkedInTime.toUTC().toISO()
      }
    })

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

