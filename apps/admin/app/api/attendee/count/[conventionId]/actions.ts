import prisma from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GetAllAttendeesForConvention(conventionId: number) : Promise<Prisma.AttendeeGetPayload<{ include: { person: { include: { relatedTo: true, _count: { select: { attendee: true}}}}}}>[]> {
  return await prisma.attendee.findMany({
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
}