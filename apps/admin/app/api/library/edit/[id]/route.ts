import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import ILibraryItemRequest from "../../../requests/library-item-request";
import { DateTime } from "ts-luxon";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";



// TODO: Add docs
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  const libraryItemIdToEdit = Number((await params).id)

  const libraryItemToEdit: ILibraryItemRequest = await request.json();
  const { boardGameGeekThing, additionalBoxContent } = libraryItemToEdit;
  const { mechanics, id, ...bggRest } = boardGameGeekThing;

  const libraryItemToUpdate = await prisma.libraryItem.findFirstOrThrow({
    where: {
      id: libraryItemIdToEdit
    }
  })

  await prisma.$transaction(async (
    transaction: Prisma.TransactionClient
  ) => {

    // 1. Add all mechanics if not already created
    await Promise.all(
      mechanics.map((gm) =>
        transaction.mechanic.upsert({
          where: { id: gm.id },
          update: { name: gm.name },
          create: {
            id: gm.id,
            name: gm.name,
          },
        })
      )
    );
    
    // Upsert board game geek db
    const upsertBggLibraryGame = await transaction.boardGameGeekThing.upsert({
      where: { id: id },
      update: {
        ...bggRest,
        gameMechanics: {
          deleteMany: {}, // Clear any existing mechanics for a fresh relation setup
          create: mechanics.map((gm) => ({
            mechanic: { connect: { id: gm.id } },
          })),
        },
      },
      create: {
        ...bggRest,
        id: id,
        gameMechanics: {
          create: mechanics.map((gm) => ({
            mechanic: { connect: { id: gm.id } },
          })),
        },
      },
    });


    if (libraryItemToUpdate?.barcode !== libraryItemToEdit.barcode) {

      await transaction.centralizedBarcode.update({
        where: {
          entityType_entityId: {
            entityType: 'LibraryItem',
            entityId: libraryItemIdToEdit
          }
        },
        data: {
          barcode: libraryItemToEdit.barcode
        }
      })

    }

    // 2. Check to see if the barcode is the same
    await transaction.libraryItem.update({
      where: { id: libraryItemIdToEdit },
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
