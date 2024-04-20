import prisma from "@/app/lib/prisma"

export async function GetAllConventions() {
  const conventions = await prisma.convention.findMany({
    include: {
      venue: true,
    },
    orderBy: {
      startDateTimeUtc: 'asc'
    }
  })

  return conventions
}