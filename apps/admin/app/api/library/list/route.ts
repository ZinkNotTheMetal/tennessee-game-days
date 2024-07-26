import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetAllLibraryItems } from "./actions"
import { LibraryListResponse } from "./response"

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
export async function GET() {

  const [count, items] = await Promise.all([
    prisma.libraryItem.count({
      where: {
        isHidden: false
      }
    }),
    GetAllLibraryItems()
  ])

  return NextResponse.json({
    total: count,
    list: items,
  });
}
