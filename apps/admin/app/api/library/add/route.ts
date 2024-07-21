import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import ILibraryItemRequest from "../../requests/library-item-request";
import { DateTime } from "ts-luxon";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/library/add:
 *   post:
 *     tags:
 *       - Library
 *     summary: Adds a new library item
 *     description: This api adds a new library item under the library items (typically board games)
 *     requestBody:
 *       description: Library Item to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LibraryItemRequest'
 *     responses:
 *       201:
 *         description: Successfully added a new library item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   description: Success message after successful library item creation
 *                 created:
 *                   type: string
 *                   description: The URL of where to edit the library item if needed
 *       400:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function POST(request: NextRequest) {
  const libraryItemToAdd: ILibraryItemRequest = await request.json();
  const { boardGameGeekThing, additionalBoxContent } = libraryItemToAdd;
  const { mechanics, id, ...bggRest } = boardGameGeekThing;

  const upsertBggLibraryGame = await prisma.boardGameGeekThing.upsert({
    where: { id: id },
    update: bggRest,
    create: {
      ...bggRest,
      id: id,
    },
  });

  await prisma.centralizedBarcode.create({
    data: {
      entityId: 0,
      entityType: "LibraryItem",
      barcode: libraryItemToAdd.barcode,
    },
  });

  const createdLibraryItem = await prisma.libraryItem.create({
    data: {
      alias:
        libraryItemToAdd?.alias?.trim() === "" ? null : libraryItemToAdd.alias,
      barcode: libraryItemToAdd.barcode,
      isHidden: libraryItemToAdd.isHidden,
      owner: libraryItemToAdd.owner,
      boardGameGeekId: upsertBggLibraryGame.id,
      isCheckedOut: false,
      updatedAtUtc: DateTime.utc().toISO(),
      dateAddedUtc: DateTime.utc().toISO(),
    },
  });

  await prisma.centralizedBarcode.update({
    where: { barcode: libraryItemToAdd.barcode },
    data: {
      entityId: Number(createdLibraryItem.id),
    },
  });

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
    })
  }

  // Add centralized barcode
  await prisma.centralizedBarcode.upsert({
    where: { barcode: libraryItemToAdd.barcode },
    create: {
      barcode: libraryItemToAdd.barcode,
      entityId: createdLibraryItem.id,
      entityType: 'LibraryItem'
    },
    update: {
      entityId: createdLibraryItem.id,
      entityType: 'LibraryItem'
    }
  })

  return NextResponse.json(
    {
      message: "Successfully added new game to library",
      created: `/library/edit/${createdLibraryItem.id}`,
    },
    { status: 201 }
  );
}
