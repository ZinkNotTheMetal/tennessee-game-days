import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetLibraryItemById } from "./actions"
import { ILibraryItem } from "@repo/shared"

export const dynamic = "force-dynamic"

/**
 * @swagger
 * /api/library/{id}:
 *   get:
 *     tags:
 *       - Library
 *     summary: Gets data related to a library item
 *     description: Gets all data listed below for a particular library item based on the unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The library item unique identifier
 *     responses:
 *       200:
 *         description: Library Item Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryItem'
 *       404:
 *         description: Library item was not found with that unique identifier
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const libraryItemId = Number((await params).id)

  const response = await GetLibraryItemById(libraryItemId)
  if (response === null) NextResponse.json({ message: "Game not found" }, { status: 404 })

  return NextResponse.json<ILibraryItem>(response ?? {} as ILibraryItem, { status: 200 })
}

/**
 * @swagger
 * /api/library/{id}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Deletes a library item
 *     description: Hard deletes a library item based on the unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The library item unique identifier
 *     responses:
 *       200:
 *         description: Library Item Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   description: Success message after successful removal of a library item
 *       404:
 *         description: Library item was not found with that unique identifier
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const libraryItemId = (await params).id
  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: Number(libraryItemId)}
  })

  if (libraryItem === null || libraryItem === undefined)
    return NextResponse.json({ message: `Library item with ${libraryItemId} not found` }, { status: 404 });


  await prisma.libraryCheckoutEvent.deleteMany({
    where: {
      libraryCopyId: Number(libraryItemId)
    }
  })

  await prisma.libraryItem.delete({
    where: { id: Number(libraryItemId) },
  });

  await prisma.centralizedBarcode.delete({
    where: {
      entityType_entityId: {
        entityId: Number(libraryItemId),
        entityType: "LibraryItem",
      },
    },
  });

  return NextResponse.json(
    {
      message: `Successfully deleted library item - ${libraryItemId}`,
    },
    { status: 200 }
  );
}
