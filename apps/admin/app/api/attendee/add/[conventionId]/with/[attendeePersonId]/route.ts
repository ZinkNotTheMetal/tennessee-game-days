import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AddAdditionalPeopleUnderPurchasingPerson } from "../../actions";
import { revalidateTag } from "next/cache";
import { AddAttendeeResponse } from "../../response";
import { IAddAttendeeWithRequest } from "@/app/api/requests/add-attendee-with-request";

export async function POST(request: NextRequest, { params }: { params: { conventionId: string, attendeePersonId: string }}) {
  const json: IAddAttendeeWithRequest = await request.json()
  const { people } = json
  let barcodesCreated: { personId: number, barcode: string | null }[] = []

  console.log('request', params)

  // Ensure the convention exists that you are trying to add conventions to
  const conventionExists = await prisma.convention.count({
    where: { id: Number(params.conventionId)}
  })

  if (conventionExists <= 0) {
    console.log('convention does not exist', request)
    return NextResponse.json({ message: 'Unable to find convention that you are trying to add the Attendee for'}, { status: 400 }) 
  }

  const personToAddUnder = await prisma.person.findFirst({
    where: { 
      id: Number(params.attendeePersonId)
    }
  })

  if (personToAddUnder === undefined) return NextResponse.json({ message: 'Unable to add people under person, as person is not found'}, { status: 404 })

  if (people !== undefined && people.length > 0) {
    console.log('Adding additional people...')

    const barcodesForAdditionalPeople = await AddAdditionalPeopleUnderPurchasingPerson(Number(params.attendeePersonId), Number(params.conventionId), people, json.isVolunteer, json.passPurchased, json.isStayingOnSite);
    barcodesForAdditionalPeople.forEach(barcode => barcodesCreated.push(barcode));
  }

  revalidateTag('attendee')

  return NextResponse.json<AddAttendeeResponse>({
    message: "Successfully added attendee to conference",
    barcodes: barcodesCreated
  },{ status: 201 })
}