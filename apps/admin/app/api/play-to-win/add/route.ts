import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { PlayToWinCsvRow } from "../../requests/ptw-csv-request"
import { DateTime } from "ts-luxon";
import { ParseCsvFile, StandardizeGameName } from "./actions";


// https://stackoverflow.com/questions/73839916/how-to-run-functions-that-take-more-than-10s-on-vercel
// https://vercel.com/docs/functions/runtimes#max-execution-time
export const maxDuration = 10; // 10 seconds

/**
 * @swagger
 * /api/play-to-win/add:
 *   post:
 *     tags:
 *       - Play to Win Games
 *     summary: Bulk adds play to win games for a convention
 *     description: Adds play to win games based on a CSV file and attaches them to the convention based on the ID
 *     requestBody:
 *       description: Form data containing the CSV file and convention ID
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvFile:
 *                 type: string
 *                 format: binary
 *                 description: The CSV file containing play to win game data
 *               conventionId:
 *                 type: number
 *                 description: The unique identifier of the convention
 *     responses:
 *       201:
 *         description: Successfully added play to win games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message after successfully adding games to play-to-win
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
 *       500:
 *         description: Error parsing CSV file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating an internal server error
 */
export async function POST(request: NextRequest) {

  const formData = await request.formData()
  const file = formData.get('csvFile') as File
  const conventionId = Number(formData.get('conventionId')?.toString())

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  } else {

    try {
      const results = await ParseCsvFile<PlayToWinCsvRow>(file)

      for(const ptwItem of results) {
        // Add barcode
        await prisma.centralizedBarcode.create({
          data: {
            entityId: 0,
            entityType: "PlayToWinItem",
            barcode: ptwItem.barcode,
          },
        })

        const gameName = StandardizeGameName(ptwItem.gameName)

        // Add to PTW Games
        const ptwAdded = await prisma.playToWinItem.create({
          data: {
            barcode: ptwItem.barcode,
            isHidden: false,
            conventionId: conventionId,
            gameName: gameName,
            publisherName: ptwItem.publisher || null,
            dateAddedUtc: DateTime.utc().toISO(),
          }
        })
        
        // Update barcode
        await prisma.centralizedBarcode.update({
          where: { barcode: ptwItem.barcode },
          data: {
            entityId: Number(ptwAdded.id),
          },
        })
      }

    } catch (error) {
      console.log('Error parsing CSV fle:', error)
      return NextResponse.json({
        error: 'Error parsing CSV file',
        },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    {
      message: "Successfully added games to play-to-win",
    },
    { status: 201 }
  );

}
