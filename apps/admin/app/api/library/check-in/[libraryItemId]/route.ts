import prisma from "@/app/lib/prisma"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { DateTime } from "ts-luxon"

/**
 * @swagger
 * /api/library/check-in/{libraryId}:
 *   put:
 *     summary: Check in a library item
 *     tags:
 *       - Barcode
 *       - Library
 *     description: Check in a game back into the library based on unique identifier
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The library item unique identifier
 *     responses:
 *       200:
 *         description: Successfully checked in the library item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   description: Success message after successful check-in of the item back into the library
 *       404:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ libraryItemId: string }> }) {
  const libraryItemId = Number((await params).libraryItemId)
  const checkedInTime = DateTime.utc()

  const libraryItem = await prisma.libraryItem.count({
    where: { id: Number(libraryItemId) }
  })

  if (libraryItem === null) return NextResponse.json({ message: "Library Item not found" }, { status: 404 })

  const result = await prisma.$transaction(async t => {
    const checkedOutEntry = await t.libraryCheckoutEvent.findFirst({
      where: {
        AND: [
          { libraryCopyId: libraryItemId },
          { checkedInTimeUtcIso: null }
        ]
      }
    })

    if (checkedOutEntry === null || checkedOutEntry === undefined) return false

    await t.libraryCheckoutEvent.update({
      where: { id: checkedOutEntry.id },
      data: { checkedInTimeUtcIso: checkedInTime.toUTC().toISO() }
    })

    await t.libraryItem.update({
      where: { id: libraryItemId },
      data: {
        isCheckedOut: false,
        totalCheckedOutMinutes: {
          increment: Number(checkedInTime.diff(DateTime.fromJSDate(checkedOutEntry.checkedOutTimeUtcIso), 'minutes').toObject().minutes?.toFixed(0))
        }
      }
    })

    return true

  })

  if (result) {
    revalidateTag('scanner')

    return NextResponse.json({
      message: 'Successfully checked in!'
      },
      { status: 200 }
    )
  } else {

    return NextResponse.json({
        message: 'Please try again, there was an error trying to find the checked Out Entry', 
      },
      { status: 500 }
    )
  }

}
