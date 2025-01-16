import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { AddAdditionalPeopleUnderPurchasingPerson, AddPurchasingPersonIntoSystem, GenerateBarcodeAndAddAttendee } from './actions'
import { IAddAttendeeRequest } from "@/app/api/requests/add-attendee-request";
import { AddAttendeeResponse } from "./response";
import { revalidateTag } from "next/cache";


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
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
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
 *       401:
 *         description: Unauthorized to call this API
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
export async function POST(request: Request, { params }: { params: Promise<{ conventionId: string }> }) {
  const conventionId = (await params).conventionId;
  const json: IAddAttendeeRequest = await request.json();
  const { person, additionalPeople, isVolunteer, isStayingOnSite, passPurchased } = json
  const { emergencyContact } = person
  let barcodesCreated: { personId: number, barcode: string | null }[] = []

  // Ensure the convention exists that you are trying to add conventions to
  const conventionExists = await prisma.convention.count({
    where: { id: Number(conventionId)}
  })

  if (conventionExists <= 0) {
    console.log('convention does not exist', request)
    return NextResponse.json({ message: 'Unable to find convention that you are trying to add the Attendee for'}, { status: 400 }) 
  }

  let personId = await AddPurchasingPersonIntoSystem(person, emergencyContact)

  if (personId === undefined) return NextResponse.json({ message: 'Unable to successfully add Purchasing Person into the system'}, { status: 523 })

  const attendeeAlreadyAdded = await prisma.attendee.findFirst({
    where: {
      AND: [
        {
          personId: personId
        },
        {
          conventionId: Number(conventionId)
        }
      ]
    }
  })

  if (attendeeAlreadyAdded) return NextResponse.json({ error: 'Attendee has already been added to this convention'}, { status: 400 })

  console.log(`Adding Purchasing Person to Attendees - PersonID: ${personId} | ConventionID: ${conventionId}`)

  let barcodeForPurchasingPerson = await GenerateBarcodeAndAddAttendee(Number(conventionId), personId, isVolunteer, passPurchased, isStayingOnSite)
  if (barcodeForPurchasingPerson.success) {
    barcodesCreated.push({ personId: personId, barcode: barcodeForPurchasingPerson.barcode })
  } else { 
    return NextResponse.json({
      message: 'Failed to add attendee as the barcode was already in the system',
    }, { status: 515 })
  }

  console.log(`Purchasing Person has barcode created - ${barcodeForPurchasingPerson.barcode}`)

  if (additionalPeople !== undefined && additionalPeople.length > 0) {
    console.log('Adding additional people...')

    const barcodesForAdditionalPeople = await AddAdditionalPeopleUnderPurchasingPerson(personId,  Number(conventionId), additionalPeople, isVolunteer, passPurchased, isStayingOnSite);
    barcodesForAdditionalPeople.forEach(barcode => barcodesCreated.push(barcode));
  }

  revalidateTag('attendee')

  return NextResponse.json<AddAttendeeResponse>({
    message: "Successfully added attendee to conference",
    barcodes: barcodesCreated
  },{ status: 201 })
}
