import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import ILibraryItemRequest from "../../requests/library-item-request";
import { DateTime } from "ts-luxon";
import { revalidateTag } from "next/cache";

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

  const createdId = await prisma.$transaction(async (t) => {

    const centralizedBarcode = await t.centralizedBarcode.create({
      data: {
        entityId: 0,
        entityType: "LibraryItem",
        barcode: libraryItemToAdd.barcode,
      },
    })

    await Promise.all(
      mechanics.map((gm) =>
        t.mechanic.upsert({
          where: { id: gm.id },
          update: { name: gm.name },
          create: {
            id: gm.id,
            name: gm.name,
          },
        })
      )
    );
    
    const upsertBggLibraryGame = await t.boardGameGeekThing.upsert({
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

    const createdLibraryItem = await t.libraryItem.create({
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

    await t.centralizedBarcode.update({
      where: { barcode: libraryItemToAdd.barcode },
      data: {
        entityId: Number(createdLibraryItem.id),
      },
    });

    return createdLibraryItem.id
  })

  if (createdId) {
    revalidateTag('library')

    return NextResponse.json(
      {
        message: "Successfully added new game to library",
        created: `/library/edit/${createdId}`,
      },
      { status: 201 })
  } else {
    return NextResponse.json({
      message: "Failed to add new game to library, please contact your administrator"
    }, 
    { status: 500})
  }
}
