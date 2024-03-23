import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import type { IConventionRequest } from "@/app/api/requests/convention-request";
import { DateTime } from 'ts-luxon'

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