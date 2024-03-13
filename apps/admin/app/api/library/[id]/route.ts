import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const libraryItemById = await prisma.libraryItem.findFirst({
      where: { id: Number(params.id) },
      include: {
        additionalContent: true,
        checkOutEvents: true,
        boardGameGeekThing: true,
      },
    });

    if (libraryItemById === null)
      return NextResponse.json({ message: "Game not found" }, { status: 404 });

    const mechanics = await prisma.gameMechanic.findMany({
      where: { boardGameGeekId: libraryItemById.boardGameGeekThingId },
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
      mechanics: [...mechanics.map((m: { mechanic: { id: number, name: string }}) => ({ id: m.mechanic.id, name: m.mechanic.name }))],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
