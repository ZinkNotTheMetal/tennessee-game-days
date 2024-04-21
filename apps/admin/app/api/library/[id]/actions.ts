import prisma from "@/app/lib/prisma"

export async function GetLibraryItemById(id: number) {
  const libraryItemById = await prisma.libraryItem.findFirst({
    where: { id: id },
    include: {
      additionalBoxContent: true,
      checkOutEvents: {
        orderBy: {
          checkedInTimeUtcIso: 'desc'
        }
      },
      boardGameGeekThing: true,
    },
  });

  if (libraryItemById === null)
    return null

  const mechanics = await prisma.gameMechanic.findMany({
    where: { boardGameGeekId: libraryItemById.boardGameGeekId },
    select: {
      mechanic: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const response = {
    ...libraryItemById,
    boardGameGeekThing: { 
      ...libraryItemById.boardGameGeekThing,
      mechanics: [...mechanics.map((m: { mechanic: { id: number, name: string }}) => ({ id: m.mechanic.id, name: m.mechanic.name }))]
    }
  }

  return response
}