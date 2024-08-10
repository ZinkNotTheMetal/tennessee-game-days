import prisma from "@/app/lib/prisma"
import { ILibraryItem } from "@repo/shared";
import { IAttendee } from "@repo/shared/src/interfaces/attendee";

export async function GetLibraryItemById(id: number) {
  const libraryItemById = await prisma.libraryItem.findFirst({
    where: { id: id },
    include: {
      additionalBoxContent: true,
      checkOutEvents: {
        orderBy: {
          checkedInTimeUtcIso: 'desc'
        },
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

  const libraryItem: ILibraryItem = {
    ...libraryItemById,
    dateAddedUtc: libraryItemById.dateAddedUtc.toISOString(),
    updatedAtUtc: libraryItemById.updatedAtUtc.toISOString(),
    additionalBoxContent: libraryItemById.additionalBoxContent.map(content => content.boardGameGeekId),
    boardGameGeekThing: {
      ...libraryItemById.boardGameGeekThing,
      description: libraryItemById.boardGameGeekThing.description ?? '',
      thumbnailUrl: libraryItemById.boardGameGeekThing.thumbnailUrl ?? '',
      imageUrl: libraryItemById.boardGameGeekThing.imageUrl ?? '',
      yearPublished: libraryItemById.boardGameGeekThing.yearPublished ?? 0,
      playingTimeMinutes: libraryItemById.boardGameGeekThing.playingTimeMinutes ?? 0,
      minimumPlayerCount: libraryItemById.boardGameGeekThing.minimumPlayerCount ?? 0,
      maximumPlayerCount: libraryItemById.boardGameGeekThing.maximumPlayerCount ?? 0,
      minimumPlayerAge: libraryItemById.boardGameGeekThing.minimumPlayerAge ?? 0,
      votedBestPlayerCount: libraryItemById.boardGameGeekThing.votedBestPlayerCount ?? 0,
      averageUserRating: Number(libraryItemById.boardGameGeekThing.averageUserRating ?? 0),
      complexityRating: Number(libraryItemById.boardGameGeekThing.complexityRating ?? 0),
      mechanics: mechanics.map(m => ({
        id: m.mechanic.id,
        name: m.mechanic.name
      }))
    },
    checkOutEvents: libraryItemById.checkOutEvents.map(event => ({
      ...event,
      checkedInTimeUtcIso: event.checkedInTimeUtcIso?.toUTCString(),
      checkedOutTimeUtcIso: event.checkedOutTimeUtcIso.toUTCString(),
      attendee: {} as IAttendee
    }))
  }

  return libraryItem;
}