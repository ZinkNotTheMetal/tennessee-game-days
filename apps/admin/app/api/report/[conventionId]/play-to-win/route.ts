import { NextRequest, NextResponse } from "next/server"
import { GetPlayToWinReportByConvention } from "./actions"
import { PlayToWinReportResponse } from "./response"

/**
 * @swagger
 * /api/report/{conventionId}/play-to-win:
 *   get:
 *     tags:
 *       - Play to Win Games
 *       - Reports
 *     summary: Play to win games and details around plays for publishers
 *     description: Retrieves details around all data for play to win games
 *     parameters:
 *       - in: path
 *         name: conventionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the convention
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               nullable: true
 *               items:
 *                 $ref: '#/components/schemas/PlayToWinReportResponse'
 *       404:
 *         description: Convention Not Found
 *         content:
 *           application/json:
 *             schema:
 *               message:
 *                 type: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const result = await GetPlayToWinReportByConvention(Number(params.conventionId))

  if (result === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })
  return NextResponse.json<PlayToWinReportResponse[] | null>(result)
}