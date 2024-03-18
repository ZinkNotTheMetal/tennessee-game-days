import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import ILibraryItemRequest from "../../requests/library-item-request";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const libraryItemToAdd: ILibraryItemRequest = await request.json();
  const { boardGameGeekThing, additionalBoxContent } = libraryItemToAdd;
  const { mechanics, id, ...bggRest } = boardGameGeekThing;

  const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
    where: { id: id },
    update: bggRest,
    create: {
      ...bggRest,
      id: id,
    },
  });

  const createdLibraryItem = await prisma.libraryItem.create({
    data: {
      alias:
        libraryItemToAdd?.alias?.trim() === "" ? null : libraryItemToAdd.alias,
      barcode: libraryItemToAdd.barcode,
      isHidden: libraryItemToAdd.isHidden,
      owner: libraryItemToAdd.owner,
      boardGameGeekId: upsertBggLibraryGame.id,
      isCheckedOut: false,
      updatedAtUtc: new Date(),
      dateAddedUtc: new Date(),
    },
  });

  await prisma.centralizedBarcode.create({
    data: {
      entityId: Number(createdLibraryItem.id),
      entityType: "LibraryItem",
      barcode: libraryItemToAdd.barcode,
    },
  });

  for (const gm of mechanics) {
    await prisma.mechanic.upsert({
      where: { id: gm.id },
      update: { name: gm.name },
      create: {
        id: gm.id,
        name: gm.name,
      },
    });

    await prisma.gameMechanic.upsert({
      where: {
        boardGameGeekId_mechanicId: {
          boardGameGeekId: upsertBggLibraryGame.id,
          mechanicId: gm.id,
        },
      },
      create: {
        mechanicId: gm.id,
        boardGameGeekId: upsertBggLibraryGame.id,
      },
      update: {
        mechanicId: gm.id,
        boardGameGeekId: upsertBggLibraryGame.id,
      },
    });
  }

  // Add centeralized id:

  return NextResponse.json(
    {
      message: "Successfully added new game to library",
      created: `/library/edit/${createdLibraryItem.id}`,
    },
    { status: 201 }
  );
}