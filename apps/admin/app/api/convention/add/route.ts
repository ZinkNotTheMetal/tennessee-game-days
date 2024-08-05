import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import type { IConventionRequest } from "@/app/api/requests/convention-request";
import { DateTime } from 'ts-luxon'
import { revalidateTag } from "next/cache";

/**
 * @swagger
 * /api/convention/add:
 *   post:
 *     tags:
 *       - Convention
 *     summary: Adds a new convention
 *     requestBody:
 *       description: Convention data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConventionRequest'
 *     description: Adds a new upcoming convention
 *     responses:
 *       201:
 *         description: Successfully added a new convention
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConventionListResponse'
 *       400:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function POST(request: NextRequest) {
  const conventionToAdd: IConventionRequest = await request.json()
  const { venue, ...convention } = conventionToAdd
  let venueAddedId = venue?.id || -1

  if (venue !== undefined) {
    const { id, ...rest } = venue
    if ((venue?.id || -1) < 0) {
      const addedVenue = await prisma.venue.create({
        data: rest
      })
      venueAddedId = addedVenue.id
    }
  }

  const createdConvention = await prisma.convention.create({
    data: {
      name: convention.name,
      startDateTimeUtc: (convention.startDateTimeUtc?.trim() ? convention.startDateTimeUtc : undefined),
      endDateTimeUtc: (convention.endDateTimeUtc?.trim() ? convention.endDateTimeUtc : undefined),
      extraHoursStartDateTimeUtc: (convention.extraHoursStartDateTimeUtc?.trim() ? convention.extraHoursStartDateTimeUtc : undefined),
      isCancelled: false,
      updatedAtUtc: DateTime.utc().toISO(),
      venueId: (venueAddedId === -1 ? undefined : Number(venueAddedId))
    }
  })

  revalidateTag('convention')

  return NextResponse.json(
    {
      message: "Successfully added new convention",
      created: `/convention/edit/${createdConvention.id}`,
    },
    { status: 201 }
  )
}
