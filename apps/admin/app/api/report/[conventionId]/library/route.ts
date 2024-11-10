import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { GetLibraryPlaytimeCounts } from "./actions"
import { LibraryReportResponse } from "./response"

/**
 * @swagger
 * /api/report/{conventionId}/library:
 *   get:
 *     tags:
 *       - Library
 *       - Reports
 *     summary: Get library playtime counts for a specific convention
 *     description: Returns the playtime counts for games in the library during a specific convention
 *     parameters:
 *       - in: path
 *         name: conventionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the convention
 *     responses:
 *       200:
 *         description: Successfully retrieved library playtime counts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LibraryReportResponse'
 *       404:
 *         description: Convention not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Convention not found
 *       522:
 *         description: Missing convention date information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Convention date information not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conventionId: string }> }
) {
  const conventionId = Number((await params).conventionId)

  const conventionForReport = await prisma.convention.findFirst({
    where: { id: conventionId }
  })

  if (conventionForReport === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })
  if (!conventionForReport.startDateTimeUtc) return NextResponse.json({ message: "Convention start date was not found" }, { status: 522 })
  if (!conventionForReport.endDateTimeUtc) return NextResponse.json({ message: "Convention end date was not found" }, { status: 522 })

  const result = await GetLibraryPlaytimeCounts(conventionId)
  return NextResponse.json<LibraryReportResponse | null>(result, { status: 200 })
}