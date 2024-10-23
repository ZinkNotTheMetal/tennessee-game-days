import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import ILibraryItemRequest from "../../../requests/library-item-request";
import { DateTime } from "ts-luxon";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";



// TODO: Add docs
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const libraryItemToEdit: ILibraryItemRequest = await request.json();
  const { boardGameGeekThing, additionalBoxContent } = libraryItemToEdit;
  const { mechanics, id, ...bggRest } = boardGameGeekThing;

  const libraryItemToUpdate = await prisma.libraryItem.findFirstOrThrow({
    where: {
      id: Number(params.id)
    }
  })

  await prisma.$transaction(async (
    transaction: Prisma.TransactionClient
  ) => {

    // 1. Update the BGG thing in the database
    const upsertBggLibraryGame = await transaction.boardGameGeekThing.upsert({
      where: { id: id },
      update: bggRest,
      create: {
        ...bggRest,
        id: id
      }
    })


    if (libraryItemToUpdate?.barcode !== libraryItemToEdit.barcode) {

      await transaction.centralizedBarcode.update({
        where: {
          entityType_entityId: {
            entityType: 'LibraryItem',
            entityId: Number(params.id)
          }
        },
        data: {
          barcode: libraryItemToEdit.barcode
        }
      })

    }

    // 2. Check to see if the barcode is the same
    await transaction.libraryItem.update({
      where: { id: Number(params.id) },
      data: {
        alias:
          libraryItemToEdit?.alias?.trim() === ""
            ? null
            : libraryItemToEdit.alias,
        barcode: libraryItemToEdit.barcode,
        isHidden: libraryItemToEdit.isHidden,
        owner: libraryItemToEdit.owner,
        boardGameGeekId: upsertBggLibraryGame.id,
        updatedAtUtc: DateTime.utc().toISO(),
      },
    })

    for (const gm of mechanics) {
      await transaction.mechanic.upsert({
        where: { id: gm.id },
        update: { name: gm.name },
        create: {
          id: gm.id,
          name: gm.name,
        },
      })

      await transaction.gameMechanic.upsert({
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

  })

  revalidateTag('library')

  return NextResponse.json(
    {
      id: libraryItemToUpdate.id,
      barcode: libraryItemToEdit.barcode,
      message: `Successfully edited - ${libraryItemToUpdate.id} - ${libraryItemToUpdate.alias ?? boardGameGeekThing.itemName} in library`,
    },
    { status: 200 }
  );
}
