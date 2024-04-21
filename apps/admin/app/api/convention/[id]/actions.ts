import prisma from "@/app/lib/prisma"

export async function GetConventionById(conventionId: number) {
  const conventionById = await prisma.convention.findFirst({
    where: { id: conventionId },
    include: {
      venue: true,
    },
  })

  return conventionById
}