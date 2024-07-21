import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import type { IConventionRequest } from "@/app/api/requests/convention-request";
import { DateTime } from 'ts-luxon'

/**
 * @swagger
 * /api/convention/edit:
 *   put:
 *     tags:
 *       - Convention
 *     summary: Edits an existing convention
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The convention ID
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const conventionToEditRequest: IConventionRequest = await request.json();
  const { venue, ...convention } = conventionToEditRequest
  let venueAddedId: number = venue?.id || -1

  console.log(venue)

  if (venue !== undefined) {
    const { id, ...rest } = venue
    if ((venue?.id || -1) < 0) {
      const addedVenue = await prisma.venue.create({
        data: rest
      })
      venueAddedId = addedVenue.id
    }
  }

  const updatedConvention = await prisma.convention.update({
    where: { id: Number(params.id) },
    data: {
      name: convention.name,
      startDateTimeUtc: (convention.startDateTimeUtc?.trim() ? convention.startDateTimeUtc : undefined),
      endDateTimeUtc: (convention.endDateTimeUtc?.trim() ? convention.endDateTimeUtc : undefined),
      extraHoursStartDateTimeUtc: (convention.extraHoursStartDateTimeUtc?.trim() ? convention.extraHoursStartDateTimeUtc : undefined),
      isCancelled: convention.isCancelled,
      updatedAtUtc: DateTime.utc().toISO(),
      venueId: (venueAddedId === -1 ? undefined : Number(venueAddedId))
    },
  });

  return NextResponse.json(
    {
      message: `Successfully edited ${convention.name}`,
    },
    { status: 200 }
  );

}