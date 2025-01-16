import { IPlayToWinRequest } from "@/app/api/requests/play-to-win-request";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";

/**
 * @swagger
 * /api/play-to-win/edit/{id}:
 *   put:
 *     tags:
 *       - Play to Win Games
 *     summary: Updates an existing play to win game
 *     description: Updates the details of an existing play to win game based on the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the play to win game
 *     requestBody:
 *       description: Play to win game data to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayToWinRequest'
 *     responses:
 *       200:
 *         description: Successfully updated the play to win game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message after successfully updating the play to win game
 *       400:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating why the request failed
 *       404:
 *         description: Play to win game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the play to win game was not found
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const playToWinItemId = (await params).id

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
    where: { id: Number(playToWinItemId) },
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

  revalidateTag('play-to-win')

  return NextResponse.json(
    {
      message: `Successfully edited ${upsertBggLibraryGame.itemName} play-to-win item`,
    },
    { status: 200 }
  );
}