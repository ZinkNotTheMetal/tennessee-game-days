import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import IEditLibraryItemRequest from "../../requests/library-item-edit";

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest) {
  const libraryItemToEdit: IEditLibraryItemRequest = await request.json();
  
  const { boardGameGeekThing, additionalBoxContent } = libraryItemToEdit
  const { mechanics, id, ...bggRest } = boardGameGeekThing;

  const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
    where: { id: id },
    update: bggRest,
    create: {
      ...bggRest,
      id: id
    },
  });

  const updatedLibraryItem = await prisma.libraryItem.update({
    where: { id: libraryItemToEdit.id },
    data: {
      alias: libraryItemToEdit?.alias?.trim() === '' ? null : libraryItemToEdit.alias,
      barcode: libraryItemToEdit.barcode,
      isHidden: libraryItemToEdit.isHidden,
      owner: libraryItemToEdit.owner,
      boardGameGeekId: upsertBggLibraryGame.id,
      updatedAtUtc: new Date()
    }
  })

  await prisma.centralizedBarcode.upsert({
    where: {
      entityType_entityId: {
        entityId: Number(updatedLibraryItem.id),
        entityType: "LibraryItem",
      },
    },
    create: {
      entityId: Number(updatedLibraryItem.id),
      entityType: "LibraryItem",
      barcode: updatedLibraryItem.barcode
    },
    update: {
      barcode: updatedLibraryItem.barcode
    }
  });

  for (const gm of mechanics) {
    await prisma.mechanic.upsert({
      where: { id: gm.id },
      update: { name: gm.name },
      create: {
        id: gm.id,
        name: gm.name
      }
    })

    await prisma.gameMechanic.upsert({
      where: { 
        boardGameGeekId_mechanicId: {
          boardGameGeekId: upsertBggLibraryGame.id,
          mechanicId: gm.id
        }
      },
      create: { 
        mechanicId: gm.id,
        boardGameGeekId: upsertBggLibraryGame.id
      },
      update: {
        mechanicId: gm.id,
        boardGameGeekId: upsertBggLibraryGame.id
      }
    })
  }

  return NextResponse.json(
    {
      message: `Successfully edited ${upsertBggLibraryGame.itemName} in library`
    },
    { status: 200 }
  )
}
