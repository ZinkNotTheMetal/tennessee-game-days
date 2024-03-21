import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";

export async function PUT(request: NextRequest, { params }: { params: { libraryId: string, attendeeId: string } }) {

  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: Number(params.libraryId) }
  })

  if (libraryItem === null) return NextResponse.json({ message: "Library Item not found" }, { status: 404 })
  if (libraryItem.isCheckedOut) return NextResponse.json({ message: "Game already checked out!" }, { status: 400 })

  await prisma.$transaction(async t => {

    await t.libraryItem.update({
      where: { id: Number(params.libraryId)},
      data: {
        isCheckedOut: true
      }
    })

    await t.libraryCheckoutEvent.create({
      data: {
        attendeeId: Number(params.attendeeId),
        checkedOutTimeUtcIso: DateTime.utc().toISO(),
        libraryCopyId: Number(params.libraryId)
      }
    })

  })

  return NextResponse.json({
    message: 'Successfully checked out!'
    },
    { status: 200 }
  )

}