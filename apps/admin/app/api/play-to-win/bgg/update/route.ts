import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";
import { Sleep, UpsertBoardGameGeekMechanics } from "./actions";


// WZ: Cannot run this on Vercel due to the timeout limitations
// I can run this locally and update the database to production
// Uncomment below locally if needed
//export const maxDuration = 300

/**
 * @swagger
 * /api/play-to-win/bgg/update:
 *   post:
 *     tags:
 *       - Play to Win Games
 *     summary: Update Play to Win items with BoardGameGeek information
 *     description: Fetches the next upcoming convention and updates Play to Win items with information from BoardGameGeek.
 *     responses:
 *       200:
 *         description: Successfully updated play to win items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the play to win items were updated
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating why the request failed
 *       516:
 *         description: No upcoming convention found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating no upcoming convention was found
 */
export async function POST(request: NextRequest) {
  // # Not sure I need this anymore...

  return NextResponse.json({
    message: 'Successfully updated play to win items'
  }, { status: 200 })
}