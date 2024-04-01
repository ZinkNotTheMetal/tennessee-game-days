import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";
import { IAddAttendeeRequest } from "@/app/api/requests/add-attendee-request";


// https://stackoverflow.com/questions/73839916/how-to-run-functions-that-take-more-than-10s-on-vercel
// https://vercel.com/docs/functions/runtimes#max-execution-time
export const maxDuration = 10; // 10 seconds

export async function POST(request: NextRequest, { params }: { params: { conventionId: string }}) {
  const attendeeToAdd: IAddAttendeeRequest = await request.json();
  let personId: number = -1

  //1. Ensure convention id exists
  const conventionExists = await prisma.convention.count({
    where: { id: Number(params.conventionId)}
  })

  if (conventionExists <= 0) return NextResponse.json({ message: 'Unable to find convention that you are trying to add the Attendee for'}, { status: 400 })

  // 2. Try to find person in the system the best we can...
  const isPersonInSystem = await prisma.person.findFirst({
    where: {
      OR: [
        { email: attendeeToAdd.email },
        { phoneNumber: attendeeToAdd.phoneNumber },
        { 
          firstName: attendeeToAdd.preferredName || attendeeToAdd.firstName,
          lastName: attendeeToAdd.lastName,
        },
        {
          firstName: attendeeToAdd.firstName,
          preferredName: attendeeToAdd.preferredName,
          lastName: attendeeToAdd.lastName,
        },
      ]
    }
  })

  if (!isPersonInSystem) {
    const personToAdd = await prisma.person.create({
      data: {
        // Merge existing data with provided data
        firstName: attendeeToAdd.firstName,
        preferredName: attendeeToAdd.preferredName,
        lastName: attendeeToAdd.lastName,
        email: attendeeToAdd.email,
        phoneNumber: attendeeToAdd.phoneNumber,
      }
    })
    personId = personToAdd.id
  } else {
    const personToUpdate = await prisma.person.update({
      where: { id: isPersonInSystem.id },
      data: {
        // Merge existing data with provided data
        firstName: attendeeToAdd.firstName || isPersonInSystem?.firstName,
        preferredName: attendeeToAdd.preferredName || isPersonInSystem?.preferredName,
        lastName: attendeeToAdd.lastName || isPersonInSystem?.lastName,
        email: attendeeToAdd.email || isPersonInSystem?.email,
        phoneNumber: attendeeToAdd.phoneNumber || isPersonInSystem?.phoneNumber,
      }
    })
    personId = personToUpdate.id
  }

  // 4. Add a new barcode for the attendee
  try {
    // Create new barcode
    const barcodeAdded = await prisma.centralizedBarcode.create({
      data: {
        entityId: 0,
        entityType: "Attendee",
        barcode: attendeeToAdd.barcode,
      },
    })

    // 5. Add new attendee after barcode was completed
    const newAttendee = await prisma.attendee.create({
      data: {
        barcode: attendeeToAdd.barcode,
        conventionId: Number(params.conventionId),
        personId: personId,
        dateRegistered: DateTime.utc().toISO()
      }
    })

    // 6. Update barcode with correct entity id
    await prisma.centralizedBarcode.update({
      where: { id: barcodeAdded.id },
      data: { 
        entityId: newAttendee.id
      }
    })

  } catch (error) {
    return NextResponse.json({
      message: 'Failed to add attendee as the barcode was already in the system',
      error: error
    }, { status: 515 })
  }

  return NextResponse.json(
    {
      message: "Successfully added attendee to conference",
    },
    { status: 201 }
  );

}
