import { NextRequest, NextResponse } from "next/server"
import { GetAttendeeCounts } from "./actions";
import { ConventionAttendeeResponse } from "./response";

/**
 * @swagger
 * /api/report/{conventionId}/attendee:
 *   get:
 *     tags:
 *       - Attendee
 *       - Reports
 *     summary: Gets a count list of attendees by convention identifier
 *     description: Retrieves a count of all attendees, checked in attendees, cancelled attendees and not checked in attendees for a convention
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
 *               $ref: '#/components/schemas/ConventionAttendeeResponse'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {
  const counts = await GetAttendeeCounts(Number(params.conventionId))

  if (counts === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })

  return NextResponse.json<ConventionAttendeeResponse>({
    conventionId: Number(params.conventionId),
    counts
  })

}