import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const libraryItemById = await prisma.libraryItem.findFirst({
    where: { id: Number(params.id) },
    include: {
      additionalBoxContent: true,
      checkOutEvents: {
        orderBy: {
          checkedInTimeUtcIso: 'desc'
        }
      },
      boardGameGeekThing: true,
    },
  });

  if (libraryItemById === null)
    return NextResponse.json({ message: "Game not found" }, { status: 404 });

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

  const response = {
    ...libraryItemById,
    boardGameGeekThing: { 
      ...libraryItemById.boardGameGeekThing,
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
