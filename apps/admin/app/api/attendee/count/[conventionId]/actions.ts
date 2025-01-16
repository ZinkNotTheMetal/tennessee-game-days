import prisma from "@/app/lib/prisma"
import { AttendeeWithPreviousConventions } from "./response";

export async function GetAllAttendeesForConvention(conventionId: number) : Promise<AttendeeWithPreviousConventions[]> {
  const attendees = await prisma.attendee.findMany({
    where: { 
      conventionId: conventionId
    },
    include: {
      person: {
        include: {
          relatedTo: true,
        }
      },
    }
  })

  // For each attendee, count previous conventions they've attended
  const attendeesWithPreviousCount = await Promise.all(attendees.map(async attendee => {
    const previousConventionsAttended = await prisma.attendee.count({
      where: {
        personId: attendee.personId,
        conventionId: { not: conventionId }, // Exclude the current convention
        isCheckedIn: true, // Only count if they were checked in
      }
    });

    return {
      ...attendee,
      previousConventionsAttended
    }
  }))

  return attendeesWithPreviousCount
}