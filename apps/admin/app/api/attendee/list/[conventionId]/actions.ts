import prisma from "@/app/lib/prisma"

export async function GetAllAttendeesForConvention(conventionId: number) {
  const attendees = await prisma.attendee.findMany({
    where: { 
      AND: [
        {
          conventionId: conventionId
        }
      ]
    },
    include: {
      person: {
        include: {
          relatedTo: true,
          _count: { select: { attendee: true }}
        }
      },
    }
  })

  return attendees
}