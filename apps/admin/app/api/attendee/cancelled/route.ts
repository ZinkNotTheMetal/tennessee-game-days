import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const person: { firstName: string, lastName: string, conventionId: number, email?: string, barcode?: string } = await request.json()

  const attendeeCancelled = await prisma.attendee.findFirst({
    where: {
      AND: [
        {
          conventionId: person.conventionId,
          checkedInUtc: null,
        },
        {
          OR: [
            {
              barcode: person.barcode ?? undefined
            },
            {
              person: {
                email: person.email ?? undefined,
              },
            },
            {
              person: {
                firstName: person.firstName,
                lastName: person.lastName,
              },
            },
            {
              person: {
                preferredName: person.firstName,
                lastName: person.lastName,
              },
            },
          ],
        },
      ],
    },
    include: {
      person: true
    }
  })

  console.log(attendeeCancelled)

  if (!attendeeCancelled) return NextResponse.json({ error: "Unable to find attendee in the system for this convention" }, { status: 404 })

  await prisma.attendee.update({
    where: {
      id: attendeeCancelled.id
    },
    data: {
      hasCancelled: !attendeeCancelled.hasCancelled
    }
  })

  revalidateTag('scanner')

  return NextResponse.json(
    {
      message: `Successfully set hasCancelled: ${!attendeeCancelled.hasCancelled} the attendee - ${attendeeCancelled.barcode} - ${attendeeCancelled.person.firstName} ${attendeeCancelled.person.lastName} for the convention - ${person.conventionId}`,
    },
    { status: 200 }
  );
}