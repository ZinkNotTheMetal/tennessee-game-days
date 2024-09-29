import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

/**
 * @swagger
 * /api/library/list:
 *   get:
 *     tags:
 *       - Library
 *     summary: Returns list of all library games
 *     description: Retrieves a list of library games (will not display hidden games)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryListResponse'
 */
export async function GET(
  request: NextRequest,
) {

  const url = new URL(request.url);
  const showHidden = url.searchParams.get("showHidden")

  if (showHidden === 'true') {

    const [count, items] = await Promise.all([
      prisma.libraryItem.count(),
      prisma.libraryItem.findMany({
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
      prisma.libraryItem.count({
        where: {
          isHidden: false
        }
      }),
      prisma.libraryItem.findMany({
        where: {
          isHidden: false
        },
        include: {
          boardGameGeekThing: true,
        },
      })
    ])
  
    return NextResponse.json({
      total: count,
      list: items,
    });

  }

}
