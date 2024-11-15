import {
  MapToBoardGameEntity,
} from "@repo/board-game-geek-shared";
import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared/src/entities/IBoardGameGeekEntity";
import { PrismaClient } from "@prisma/client";
import { DateTime } from 'ts-luxon'

export const prisma = new PrismaClient();

function sleep (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function LookupGameById(bggId: number) {

  const result = await SearchBoardGameGeek(String(bggId), true);

  await sleep(1900)

  if (result.totalCount === 0) return;
  if (result.results === undefined || result.results.length === 0) return;
  if (result.results[0] === undefined) return;

  if (result.results[0].id !== bggId) {
    console.log(
      "Error: Did not match on ID properly",
      bggId,
      result.results[0].id
    );
  }

  return result.results[0]
}

export default async function AddLibraryItemToDatabase(
  bggIdToAdd: number,
  barcode: string,
  alias: string | null,
  includedItems: number[]
) {
  const bggResultFromIdToAdd = await LookupGameById(bggIdToAdd);

  if (bggResultFromIdToAdd === undefined) return;

  const bggGame: IBoardGameGeekEntity =
    MapToBoardGameEntity(bggResultFromIdToAdd);
  const { mechanics, id, ...allOtherProperties } = bggGame;

  // Upsert BGG Game from library
  const bggAddedId = await UpsertBggGame(id, allOtherProperties, mechanics);

  // Add other content here
  for (const includedItemInBox of includedItems) {
    console.log(" Included Item:", includedItemInBox);
    let bggContentInBox = await LookupGameById(includedItemInBox);
    if (bggContentInBox === undefined) return;

    let boxContentGame: IBoardGameGeekEntity =
      MapToBoardGameEntity(bggContentInBox);
    const { mechanics, id, ...contentProperties } = boxContentGame;

    // Upsert BGG Game from library
    await UpsertBggGame(id, contentProperties, mechanics);
  }

  await AddMechanicsToDatabase(bggAddedId, mechanics)

  const libraryIdAdded = await AddBggGameToLibrary(
    barcode,
    bggAddedId,
    alias,
    DetermineGameOwner(barcode)
  );

  // Add to centralized barcode
  console.log("Successfully Added:", barcode, bggAddedId);
}

async function AddBggGameToLibrary(
  barcode: string,
  bggId: number,
  alias: string | null,
  owner: string
): Promise<number> {
  let centralizedBarcodeId: number = -1
  try {
    const centralizedBarcode = await prisma.centralizedBarcode.create({
      data: {
        barcode: barcode,
        entityId: 0,
        entityType: 'LibraryItem',
      }
    })
    centralizedBarcodeId = centralizedBarcode.id
  } catch (error) {
    console.log('  Barcode already found in the system...', barcode)
    return 0 // Barcode is already in the system
  }
  
  const libraryItem = await prisma.libraryItem.upsert({
    where: { barcode: barcode },
    update: {
      boardGameGeekThing: {
        connect: { id: bggId },
      },
      alias: alias,
      owner: owner,
      isHidden: false,
      isCheckedOut: false,
      updatedAtUtc: DateTime.utc().toISO(),
    },
    create: {
      boardGameGeekThing: {
        connect: { id: bggId },
      },
      owner: owner,
      alias: alias,
      centralizedBarcode: {
        connect: { id: centralizedBarcodeId }
      },
      isHidden: false,
      isCheckedOut: false,
      dateAddedUtc: DateTime.utc().toISO(),
      updatedAtUtc: DateTime.utc().toISO(),
    },
  })

  await prisma.centralizedBarcode.update({
    where: { barcode: barcode },
    data: {
      entityId: libraryItem.id
    }
  })

  return libraryItem.id;
}

async function AddMechanicsToDatabase(
  bggId: number,
  mechanics: { id: number; name: string }[]
) {
  await Promise.all(
    mechanics.map((gm) =>
      prisma.mechanic.upsert({
        where: { id: gm.id },
        update: { name: gm.name },
        create: {
          id: gm.id,
          name: gm.name,
        },
      })
    )
  );

}

function DetermineGameOwner(barcode: string) {
  if (barcode.toUpperCase().includes("RR")) {
    return "Russ Rupe";
  } else if (barcode.toUpperCase().includes("RK")) {
    return "Rick Keuler";
  } else if (barcode.toUpperCase().includes("GP")) {
    return "Game Point";
  } else {
    return "Library";
  }
}

async function UpsertBggGame(
  bggItemToAdd: number,
  bggProperties: {
    itemName: string
    description: string
    type: string
    thumbnailUrl: string
    imageUrl: string
    yearPublished: number
    publisherName: string | null
    playingTimeMinutes: number
    minimumPlayerCount: number
    maximumPlayerCount: number
    minimumPlayerAge: number
    averageUserRating: number
    complexityRating: number
    votedBestPlayerCount: number | null
  },
  mechanics: { id: number; name: string }[]
): Promise<number> {


  const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
    where: { id: bggItemToAdd },
    update: {
      ...bggProperties,
      gameMechanics: {
        deleteMany: {}, // Clear any existing mechanics for a fresh relation setup
        create: mechanics.map((gm) => ({
          mechanic: { connect: { id: gm.id } },
        })),
      },
    },
    create: {
      ...bggProperties,
      id: bggItemToAdd,
      gameMechanics: {
        create: mechanics.map((gm) => ({
          mechanic: { connect: { id: gm.id } },
        })),
      },
    },
  });

  return upsertBggLibraryGame.id;
}
