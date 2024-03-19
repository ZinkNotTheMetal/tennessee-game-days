import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import type { IConventionRequest } from "@/app/api/requests/convention-request";
import { DateTime } from 'ts-luxon'

export async function POST(request: NextRequest) {
  const conventionToAdd: IConventionRequest = await request.json()
  const { venue, ...convention } = conventionToAdd
  let venueAddedId = venue?.id || -1

  if ((!venue?.id) && venue) {
    const createdVenue = await prisma.venue.create({
      data: venue
    })
    venueAddedId = createdVenue.id
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

  return NextResponse.json(
    {
      message: "Successfully added new convention",
      created: `/convention/edit/${createdConvention.id}`,
    },
    { status: 201 }
  )
}
