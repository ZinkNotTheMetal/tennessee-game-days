import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import IAddLibraryItemRequest from "../requests/library-item-add";

export async function POST(request: NextRequest) {
  try {
    const libraryItemToAdd: IAddLibraryItemRequest = await request.json();
    const { boardGameGeekId, boardGameGeekThing, ...rest } = libraryItemToAdd;
    const { mechanics, ...bggRest } = boardGameGeekThing;

    const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
      where: { id: boardGameGeekId },
      update: bggRest,
      create: {
        ...bggRest,
        id: boardGameGeekId,
      },
    });

    const createdLibraryItem = await prisma.libraryItem.create({
      data: {
        ...rest,
        boardGameGeekId: upsertBggLibraryGame.id,
        boardGameGeekThing: {
          connect: { id: upsertBggLibraryGame.id },
        },
        isCheckedOut: false,
        additionalContent: {
          createMany: {
            data: libraryItemToAdd.additionalBoxContent.map(bggId => ({
              boardGameGeekId: bggId,
            }))
          }
        }
      }
    })

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


    NextResponse.json(
      {
        message: "Successfully added",
        created: `/library/edit/${createdLibraryItem.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
