import prisma from "@/app/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GetAllConventions() : Promise<Prisma.ConventionGetPayload<{
  include: {
    venue: true
  },
  orderBy: {
    startDateTimeUtc: 'asc'
  }
}>[]> {
  const conventions = await prisma.convention.findMany({
    include: {
      venue: true,
    },
    orderBy: {
      startDateTimeUtc: 'asc'
    },
    take: 15
  })

  return conventions
}