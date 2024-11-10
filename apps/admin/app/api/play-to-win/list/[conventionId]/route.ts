import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayToWinGameResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total play-to-win game count for the convention
 *         list:
 *           type: array
 *           description: All (non-hidden) games in the Play-to-Win library
 *           items:
 *             $ref: '#/components/schemas/PlayToWinItem'
 *     PlayToWinItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: "Unique identifier for the game entry."
 *         barcode:
 *           type: string
 *           description: "Barcode of the play-to-win game."
 *         boardGameGeekId:
 *           type: integer
 *           format: int32
 *           nullable: true
 *           description: "Optional ID of the game on BoardGameGeek."
 *         gameName:
 *           type: string
 *           description: "Name of the game."
 *         publisherName:
 *           type: string
 *           description: "Publisher's name for the game."
 *         dateAddedUtc:
 *           type: string
 *           format: date-time
 *           description: "UTC date when the game was added."
 *         boardGameGeekThing:
 *           type: object
 *           nullable: true
 *           description: "Optional object containing additional details from BoardGameGeek."
 *           $ref: '#/components/schemas/BoardGameGeekThing'
 * /api/play-to-win/list/{conventionId}:
 *   get:
 *     tags:
 *       - Play to Win Games
 *     parameters:
 *       - in: path
 *         name: conventionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the convention
 *     summary: Returns list of all play-to-win games for a specific convention
 *     description: Retrieves a list of play-to-win games (will not display hidden games)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayToWinGameResponse'
 */


export async function GET(request: Request,
  { params }: { params: Promise<{ conventionId: string }> }
) {

  const conventionId = Number((await params).conventionId)
  const url = new URL(request.url);
  const showHidden = url.searchParams.get("showHidden")

  if (showHidden === 'true') {

    const [count, items] = await Promise.all([
      prisma.playToWinItem.count({
        where: {
          conventionId: conventionId
        }
      }),
      prisma.playToWinItem.findMany({
        where: {
          conventionId: conventionId
        },
        include: {
          boardGameGeekThing: true,
        },
      })
    ])

    return NextResponse.json({
      total: count,
      list: items,
    })

  } else {

    const [count, items] = await Promise.all([
      prisma.playToWinItem.count({
        where: {
          AND: [
            { 
              conventionId: conventionId
            },
            { 
              isHidden: false
            }
          ]
        }
      }),
      prisma.playToWinItem.findMany({
        where: {
          AND: [
            { 
              conventionId: conventionId
            },
            { 
              isHidden: false
            }
          ]
        },
        select: {
          id: true,
          barcode: true,
          boardGameGeekId: true,
          boardGameGeekThing: true,
          gameName: true,
          publisherName: true,
          dateAddedUtc: true
        }
      })
    ])
  
    return NextResponse.json({
      total: count,
      list: items,
    });

  }
}