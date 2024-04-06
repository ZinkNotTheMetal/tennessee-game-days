import { IPlayToWinRequest } from "@/app/api/requests/play-to-win-request";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const playToWinItem: IPlayToWinRequest = await request.json();

  const { boardGameGeekThing, _count, ...rest } = playToWinItem;
  const { mechanics, id: bggId, ...bggRest } = boardGameGeekThing;

  const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
    where: { id: bggId },
    update: bggRest,
    create: {
      ...bggRest,
      id: bggId,
    },
  });

  const updatePlayToWinItem = await prisma.playToWinItem.update({
    where: { id: Number(params.id) },
    data: {
      ...rest
    },
  })

  await prisma.centralizedBarcode.upsert({
    where: {
      entityType_entityId: {
        entityId: Number(updatePlayToWinItem.id),
        entityType: "PlayToWinItem",
      },
    },
    create: {
      entityId: Number(updatePlayToWinItem.id),
      entityType: "PlayToWinItem",
      barcode: updatePlayToWinItem.barcode,
    },
    update: {
      barcode: updatePlayToWinItem.barcode,
    },
  })

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

  return NextResponse.json(
    {
      message: `Successfully edited ${upsertBggLibraryGame.itemName} play-to-win item`,
    },
    { status: 200 }
  );
}