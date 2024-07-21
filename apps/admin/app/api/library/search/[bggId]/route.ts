import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { BggSearchResponse } from "./response";

/**
 * @swagger
 * /api/library/search/{bggId}:
 *   get:
 *     tags:
 *       - Library
 *     summary: Searches library for games using Board Game Geek ID (BggID)
 *     description: Retrieves multiple games (potentially multiple copies) of a game by Board Game Geek ID
 *     parameters:
 *       - in: path
 *         name: bggId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier that Board Game Geek uses to identify a game
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryListResponse'
 */
export async function GET(request: NextRequest, { params }: { params: { bggId: string } }) {
  const libraryCountWithBggId = await prisma.libraryItem.count({ where: { boardGameGeekId: Number(params.bggId)} });

  if (libraryCountWithBggId == 0) return NextResponse.json({ total: 0, results: []}, { status: 200 })

  const libraryItemsWithBggId = await prisma.libraryItem.findMany({
    where: { boardGameGeekId: Number(params.bggId) },
    include: {
      boardGameGeekThing: true
    }
  });

  return NextResponse.json<BggSearchResponse>({
    total: libraryCountWithBggId,
    list: libraryItemsWithBggId
  });
}