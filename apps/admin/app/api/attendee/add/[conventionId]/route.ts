import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { GenerateBarcodeAndAddAttendee } from './actions'
import { IAddAttendeeRequest } from "@/app/api/requests/add-attendee-request";
import { AddAttendeeResponse } from "./response";


// https://stackoverflow.com/questions/73839916/how-to-run-functions-that-take-more-than-10s-on-vercel
// https://vercel.com/docs/functions/runtimes#max-execution-time
export const maxDuration = 10; // 10 seconds

/**
 * @swagger
 * /api/attendee/add/{conventionId}:
 *   post:
 *     tags:
 *       - Convention
 *       - Attendee
 *     summary: Adds a person to a convention
 *     description: Adds people to the convention and turns them into an attendee, use this after they have successfully purchased a ticket
 *     parameters:
 *       - in: path
 *         name: conventionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The convention ID
 *     requestBody:
 *       description: People information data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddAttendeeRequest'
 *     responses:
 *       201:
 *         description: Attendees successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddAttendeeResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 *       515:
 *         description: Failed to add attendee as the barcode was already in the system
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 */
export async function POST(request: NextRequest, { params }: { params: { conventionId: string }}) {
  const json: IAddAttendeeRequest = await request.json();
  const { person, additionalPeople, isStayingOnSite, passPurchased } = json
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

  if (additionalPeople !== undefined) {

    for (const additionalAttendee of additionalPeople) {
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

  return NextResponse.json<AddAttendeeResponse>({
    message: "Successfully added attendee to conference",
    barcodes: barcodesCreated
  },{ status: 201 })
}
