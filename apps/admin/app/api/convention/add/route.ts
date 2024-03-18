import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { IAddConventionItemRequest } from "../../requests/convention-add";

export async function POST(request: NextRequest) {
  const conventionToAdd: IAddConventionItemRequest = await request.json()

  const { venue, ...rest } = conventionToAdd

  let venueAddedId = -1

  if (venue !== undefined) {

    const newVenue = await prisma.venue.upsert({
      where: { id: venue.id },
      update: venue,
      create: venue
    })

    venueAddedId = newVenue.id
  }

  const createdConvention = await prisma.convention.create({
    data: {
      name: rest.name,
      isCancelled: rest.isCanceled,
      //additionalTimeStartDateTimeUtc?: string
      startDateUtc: rest.startDateTimeUtc,
      endDateUtc: rest.endDateTimeUtc,
      updatedAtUtc: new Date(),
      venueId: (venueAddedId === -1 ? undefined : venueAddedId)
    }
  })

  return NextResponse.json(
    {
      message: "Successfully added new game to library",
      created: `/convention/edit/${createdConvention.id}`,
    },
    { status: 201 }
  )
}
