import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { DateTime } from "ts-luxon"

/**
 * @swagger
 * /api/library/check-in/{libraryId}:
 *   put:
 *     summary: Check in a library item
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
          increment: Number(checkedInTime.diff(DateTime.fromJSDate(result.checkedOutTimeUtcIso), 'minutes').toObject().minutes?.toFixed(0))
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

