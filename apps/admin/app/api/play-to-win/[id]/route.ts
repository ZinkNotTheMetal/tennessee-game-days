import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

/**
 * @swagger
 * /api/play-to-win/{id}:
 *   get:
 *     tags:
 *       - Play to Win Games
 *     summary: Get details of a Play to Win item by ID
 *     description: Retrieves details of a Play to Win item along with its associated BoardGameGeek information and mechanics by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Play to Win item to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved Play to Win item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: unique identifier for the play to win item
 *                 barcode:
 *                   type: string
 *                   description: The unique barcode for the play to win
 *                 gameName:
 *                   type: string
 *                   description: The name of the play to win name
 *                 isHidden:
 *                   type: boolean
 *                   description: Flag that states if a game is hidden from users
 *                 publisherName:
 *                   type: string
 *                   description: The name of the publisher
 *                 dateAddedUtc:
 *                   type: string
 *                   format: date-time
 *                 boardGameGeekThing:
 *                   $ref: '#/components/schemas/BoardGameGeekThing'
 *                 _count:
 *                   type: object
 *                   properties:
 *                     playToWinPlays:
 *                       type: number
 *                       description: Amount of plays people have played for this item
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the game was not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const playToWinItemById = await prisma.playToWinItem.findFirst({
    where: { id: Number(params.id) },
    include: {
      boardGameGeekThing: true,
      _count: true,
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

/**
 * @swagger
 * /api/play-to-win/{id}:
 *   delete:
 *     summary: Removes a play to win item from a convention
 *     tags:
 *       - Play to Win Games
 *     description: Hard deletes a play to win item from the database, play to win items are tied with a convention. Also removes the barcode from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for play to win item
 *     responses:
 *       200:
 *         description: Play to Win item successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 *       404:
 *         description: Play to win item not found with that unique identifier
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const playToWinItemId = Number(params.id);

  // Check if playToWinItem exists
  const playToWinItem = await prisma.playToWinItem.findUnique({
    where: { id: playToWinItemId },
  });

  if (!playToWinItem) {
    return NextResponse.json({ message: `Play to win item with id ${params.id} not found` }, { status: 404 });
  }

  // Fetch all PlayToWinPlay IDs associated with this playToWinItem
  const playToWinPlayIds = (
    await prisma.playToWinPlay.findMany({
      where: { playToWinItemId },
      select: { id: true },
    })
  ).map((play: { id: string; }) => play.id);

  // Delete all related PlayToWinPlayAttendee records
  await prisma.playToWinPlayAttendee.deleteMany({
    where: {
      playToWinPlayId: { in: playToWinPlayIds },
    },
  });

  // Delete all related PlayToWinPlay records
  await prisma.playToWinPlay.deleteMany({
    where: { playToWinItemId },
  });

  // Delete the PlayToWinItem record itself
  await prisma.playToWinItem.delete({
    where: { id: playToWinItemId },
  });

  await prisma.centralizedBarcode.delete({
    where: {
      entityType_entityId: {
        entityId: playToWinItemId,
        entityType: "PlayToWinItem",
      },
    },
  });

  return NextResponse.json(
    {
      message: `Successfully deleted play to win item - ${params.id}`,
    },
    { status: 200 }
  );
}
