import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const playToWinItemById = await prisma.playToWinItem.findFirst({
    where: { id: Number(params.id) },
    include: {
      boardGameGeekThing: true
    }
  })

  if (playToWinItemById === null)
    return NextResponse.json({ message: "Game not found" }, { status: 404 });

  let mechanics: {mechanic: {id: number, name:string }}[] = []

  if (playToWinItemById.boardGameGeekId) {
    mechanics = await prisma.gameMechanic.findMany({
      where: { boardGameGeekId: playToWinItemById.boardGameGeekId },
      select: {
        mechanic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  }

  const response = {
    ...playToWinItemById,
    boardGameGeekThing: { 
      ...playToWinItemById.boardGameGeekThing,
      mechanics: [...mechanics.map((m: { mechanic: { id: number, name: string }}) => ({ id: m.mechanic.id, name: m.mechanic.name }))]
    }
  };

  return NextResponse.json(response);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.libraryItem.delete({
    where: { id: Number(params.id) },
  });

  await prisma.centralizedBarcode.delete({
    where: {
      entityType_entityId: {
        entityId: Number(params.id),
        entityType: "LibraryItem",
      },
    },
  });

  return NextResponse.json(
    {
      message: `Successfully deleted library item - ${params.id}`,
    },
    { status: 200 }
  );
}
