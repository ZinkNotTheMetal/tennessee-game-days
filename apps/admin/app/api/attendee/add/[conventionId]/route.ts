import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";
import { IAddAttendeeRequest } from "@/app/api/requests/add-attendee-request";


// https://stackoverflow.com/questions/73839916/how-to-run-functions-that-take-more-than-10s-on-vercel
// https://vercel.com/docs/functions/runtimes#max-execution-time
export const maxDuration = 10; // 10 seconds

export async function POST(request: NextRequest, { params }: { params: { conventionId: string }}) {
  const json: IAddAttendeeRequest = await request.json();
  const { person, additionalAttendees, isStayingOnSite, passPurchased } = json
  const { emergencyContact } = person
  let personId: number = -1
  let barcodesCreated: { personId: number, barcode: string | null }[] = []

  //1. Ensure convention id exists
  const conventionExists = await prisma.convention.count({
    where: { id: Number(params.conventionId)}
  })

  if (conventionExists <= 0) return NextResponse.json({ message: 'Unable to find convention that you are trying to add the Attendee for'}, { status: 400 })

  // 2. Try to find person in the system the best we can...
  const isPersonInSystem = await prisma.person.findFirst({
    where: {
      OR: [
        { email: person.email ? person.email : undefined },
        { phoneNumber: person.phoneNumber ? person.phoneNumber : undefined },
        { 
          firstName: person.preferredName || person.firstName,
          lastName: person.lastName,
        },
        {
          firstName: person.firstName,
          preferredName: person.preferredName,
          lastName: person.lastName,
        },
      ]
    }
  })

  if (!isPersonInSystem) {
    const personToAdd = await prisma.person.create({
      data: {
        // Merge existing data with provided data
        firstName: person.firstName,
        preferredName: person.preferredName,
        lastName: person.lastName,
        email: person.email,
        phoneNumber: person.phoneNumber,
        zipCode: person.zipCode,
        emergencyContactName: emergencyContact?.name,
        emergencyContactPhoneNumber: emergencyContact?.phoneNumber,
        emergencyContactRelationship: emergencyContact?.relationship,
      }
    })
    personId = personToAdd.id
  } else {
    const personToUpdate = await prisma.person.update({
      where: { id: isPersonInSystem.id },
      data: {
        // Merge existing data with provided data
        firstName: person.firstName || isPersonInSystem?.firstName,
        preferredName: person.preferredName || isPersonInSystem?.preferredName,
        lastName: person.lastName || isPersonInSystem?.lastName,
        email: person.email || isPersonInSystem?.email,
        phoneNumber: person.phoneNumber || isPersonInSystem?.phoneNumber,
      }
    })
    personId = personToUpdate.id
  }

  const attendeeAlreadyAdded = await prisma.attendee.findFirst({
    where: { personId: personId }
  })

  if (attendeeAlreadyAdded) return NextResponse.json({ error: 'Attendee has already been added to this convention'}, { status: 400 })

  const response = await GenerateBarcodeAndAddAttendee(Number(params.conventionId), personId, passPurchased, isStayingOnSite)
  if (response.success) {
    barcodesCreated.push({ personId: personId, barcode: response.barcode})
  } else {
    return NextResponse.json({
      message: 'Failed to add attendee as the barcode was already in the system',
    }, { status: 515 })
  }

  if (additionalAttendees !== undefined) {

    for (const additionalAttendee of additionalAttendees) {
      const additionalPersonToAdd = await prisma.person.upsert({
        where: { 
          firstName_lastName_relatedPersonId: {
            firstName: additionalAttendee.firstName,
            lastName: additionalAttendee.lastName,
            relatedPersonId: personId
          }
         },
        create: {
          email: additionalAttendee.email || null,
          firstName: additionalAttendee.firstName,
          lastName: additionalAttendee.lastName,
          preferredName: additionalAttendee.preferredName,
          relatedPersonId: personId,
        },
        update: {
          email: additionalAttendee.email || null,
          firstName: additionalAttendee.firstName,
          preferredName: additionalAttendee.preferredName,
          lastName: additionalAttendee.lastName,
        }
      })
  
      const response = await GenerateBarcodeAndAddAttendee(Number(params.conventionId), additionalPersonToAdd.id, passPurchased, isStayingOnSite)
      if (response.success) {
        barcodesCreated.push({ personId: additionalPersonToAdd.id, barcode: response.barcode })
      }
    }

  }

  return NextResponse.json({
    message: "Successfully added attendee to conference",
    barcodesCreated
  },{ status: 201 })
}


async function GenerateBarcodeAndAddAttendee(
  conventionId: number, 
  personId: number, 
  passPurchased: 'Free' | 'Individual' | 'Couple' | 'Family',
  stayingOnSite: boolean
): Promise<{ success: boolean, barcode: string | null }> {
  let success = false
  let barcode: string | null = null
  try {
    const generatedBarcode = `${DateTime.now().toFormat('yy')}${conventionId}-${personId}`

    // 4. Add a new barcode in a transaction
    prisma.$transaction(async (transaction) => {
      const newBarcode = await transaction.centralizedBarcode.create({
        data: {
          entityId: 0,
          entityType: 'Attendee',
          barcode: generatedBarcode
        }
      })

      const newAttendee = await transaction.attendee.create({
        data: {
          barcode: generatedBarcode,
          isStayingOnSite: stayingOnSite,
          passPurchased: passPurchased,
          conventionId: conventionId,
          personId: personId,
          dateRegistered: DateTime.utc().toISO()
        }
      })

      await transaction.centralizedBarcode.update({
        where: { id: newBarcode.id },
        data: { 
          entityId: newAttendee.id
        }
      })

    })
    success = true
    barcode = generatedBarcode

  } catch (error) {
    throw error
  } finally {
    return { success: success, barcode: barcode }
  }

}