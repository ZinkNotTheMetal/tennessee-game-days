import { NextResponse } from 'next/server';
import prisma from "@/app/lib/prisma"
import { stringify } from 'csv-stringify/sync'; // Using sync for simplicity

export async function GET(request: Request, { params }: { params: Promise<{ conventionId: string }> }) {
  const conventionId = (await params).conventionId

  const conventionById = await prisma.convention.findFirst({
    where: { id: Number(conventionId) },
    include: {
      venue: true,
    },
  });

  if (!conventionById) {
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });
  }

  const csvFileName = `${conventionById.name}_${conventionById.startDateTimeUtc?.getFullYear()}${conventionId}_attendees.csv`;
  const columns = ['Barcode', 'First Name', 'Preferred Name', 'Last Name', 'Volunteer', 'Conventions Attended', 'Email'];

  const attendees = await prisma.attendee.findMany({
    where: {
      conventionId: conventionById.id
    },
    include: {
      person: {
        include: {
          relatedTo: true,
        }
      }
    },
    orderBy: {
      barcode: 'asc'
    }
  });

  const attendeesWithPreviousCount = await Promise.all(attendees.map(async attendee => {
    const previousConventionsAttended = await prisma.attendee.count({
      where: {
        personId: attendee.personId,
        conventionId: { not: conventionById.id }, // Exclude the current convention
        isCheckedIn: true, // Only count if they were checked in
      }
    });

    return {
      'Barcode': attendee.barcode,
      'First Name': attendee.person.firstName,
      'Preferred Name': attendee.person.preferredName || '',
      'Last Name': attendee.person.lastName,
      'Conventions Attended': previousConventionsAttended.toString(),
      'Email': attendee.person.email || '',
      'Volunteer': attendee.isVolunteer,
    };
  }));

  const csvData = stringify(attendeesWithPreviousCount, { header: true, columns });

  return new NextResponse(csvData, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${csvFileName}"`,
    }
  })
}