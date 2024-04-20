import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetLibraryItemById } from "./actions"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await GetLibraryItemById(Number(params.id))
  if (response === null) NextResponse.json({ message: "Game not found" }, { status: 404 })

  return NextResponse.json(response, { status: 200 })
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
