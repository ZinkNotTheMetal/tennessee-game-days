import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import type { IConventionRequest } from "@/app/api/requests/convention-request";
import { DateTime } from 'ts-luxon'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const conventionToEditRequest: IConventionRequest = await request.json();
  const { venue, ...convention } = conventionToEditRequest
  let venueAddedId = venue?.id || -1

  // If Venue is filled out it's new
  // If not then it's just an ID
  if (venue !== undefined) {

    if (!(venue.id)) {
      const newVenue = await prisma.venue.create({
        data: {
          ...venue,
          id: undefined
        }
      })
      venueAddedId = newVenue.id
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