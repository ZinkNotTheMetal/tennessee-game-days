import {
  SearchBoardGameGeek,
  MapToBoardGameEntity,
} from "@repo/board-game-geek-shared";
import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared/src/entities/IBoardGameGeekEntity";
import { PrismaClient } from "@prisma/client";

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
  const { mechanics, boardGameGeekId, ...allOtherProperties } = bggGame;

  // Upsert BGG Game from library
  console.log("Upserting Bgg Game:", boardGameGeekId);
  const bggAddedId = await UpsertBggGame(boardGameGeekId, allOtherProperties);

  // Add other content here
  for (const includedItemInBox of includedItems) {
    console.log(" Included Item:", includedItemInBox);
    let bggContentInBox = await LookupGameById(includedItemInBox);
    if (bggContentInBox === undefined) return;

    let boxContentGame: IBoardGameGeekEntity =
      MapToBoardGameEntity(bggContentInBox);
    const { mechanics, boardGameGeekId, ...contentProperties } = boxContentGame;

    // Upsert BGG Game from library
    await UpsertBggGame(boardGameGeekId, contentProperties);
  }

  // Add mechanics to main library item
  console.log("Add mechanics to game:", bggAddedId);
  await AddMechanicsToDatabase(bggAddedId, mechanics);

  // Add game to library
  console.log("Add game to library:", bggAddedId);
  const libraryIdAdded = await AddBggGameToLibrary(
    barcode,
    bggAddedId,
    alias,
    DetermineGameOwner(barcode)
  );

  // Add to centralized barcode
  console.log("Finally updating item barcode:", bggAddedId);
  await UpsertLibraryItemBarcode(barcode, libraryIdAdded);
}

async function AddBggGameToLibrary(
  barcode: string,
  bggId: number,
  alias: string | null,
  owner: string
): Promise<number> {
  // Need to be careful, don't have a great way to upsert
  const libraryItem = await prisma.libraryItem.upsert({
    where: { barcode: barcode },
    update: {
      boardGameGeekThing: {
        connect: { boardGameGeekId: bggId },
      },
      alias: alias,
      owner: owner,
      isHidden: false,
      isCheckedOut: false,
      updatedAtUtc: new Date(),
    },
    create: {
      boardGameGeekThing: {
        connect: { boardGameGeekId: bggId },
      },
      owner: owner,
      alias: alias,
      barcode: barcode,
      isHidden: false,
      isCheckedOut: false,
      dateAddedUtc: new Date(),
      updatedAtUtc: new Date(),
    },
  });

  return libraryItem.id;
}

async function UpsertLibraryItemBarcode(
  barcode: string,
  libraryItemAddedId: number
) {
  await prisma.centralizedBarcode.upsert({
    where: { barcode: barcode },
    update: {
      entityType: "LibraryItem",
      entityId: libraryItemAddedId,
    },
    create: {
      barcode: barcode,
      entityType: "LibraryItem",
      entityId: libraryItemAddedId,
    },
  });
}

async function AddMechanicsToDatabase(
  bggId: number,
  mechanics: { id: number; name: string }[]
) {
  // Add mechanics to base table (id / name)
  for (const mechanic of mechanics) {
    const upsertMechanic = await prisma.mechanic.upsert({
      where: { id: mechanic.id },
      create: {
        id: mechanic.id,
        name: mechanic.name,
      },
      update: {
        id: mechanic.id,
        name: mechanic.name,
      },
    });

    await prisma.gameMechanic.upsert({
      where: {
        boardGameGeekId_mechanicId: {
          boardGameGeekId: bggId,
          mechanicId: upsertMechanic.id,
        },
      },
      create: {
        boardGameGeekId: bggId,
        mechanicId: mechanic.id,
      },
      update: {
        boardGameGeekId: bggId,
        mechanicId: mechanic.id,
      },
    });
  }
}

function DetermineGameOwner(barcode: string) {
  if (barcode.toUpperCase().includes("RR")) {
    return "Russ Rupe";
  } else if (barcode.toUpperCase().includes("RK")) {
    return "Richard Keuler";
  } else if (barcode.toUpperCase().includes("GP")) {
    return "Game Point";
  } else {
    return "Library";
  }
}

async function UpsertBggGame(
  bggItemToAdd: number,
  bggProperties: {
    itemName: string;
    description: string;
    type: string;
    thumbnailUrl: string;
    imageUrl: string;
    yearPublished: number;
    playingTimeMinutes: number;
    minimumPlayerCount: number;
    maximumPlayerCount: number;
    minimumPlayerAge: number;
    averageUserRating: number;
    complexityRating: number;
    votedBestPlayerCount: number | null;
  }
): Promise<number> {

  const upsertGame = await prisma.boardGameGeekThing.upsert({
    where: { boardGameGeekId: bggItemToAdd },
    update: bggProperties,
    create: {
      ...bggProperties,
      boardGameGeekId: bggItemToAdd,
    },
  });

  return upsertGame.boardGameGeekId;
}