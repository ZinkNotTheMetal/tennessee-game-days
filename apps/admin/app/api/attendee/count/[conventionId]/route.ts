import { NextRequest, NextResponse } from "next/server"
import { GetAllAttendeesForConvention } from "./actions"
import { AttendeeCountResponse } from "./response"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

/**
 * @swagger
 * /api/attendee/count/{conventionId}:
 *   get:
 *     tags:
 *       - Convention
 *       - Attendee
 *     summary: Gets a list of all attendee counts
 *     description: Gets a total list of attendee counts based on convention ID passed in
 *     parameters:
 *       - in: path
 *         name: conventionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier for the convention
 *     responses:
 *       200:
 *         description: Attendee counts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendeeCountResponse'
 */
export async function GET(request: NextRequest, { params }: { params: { conventionId: string }}) {
  const attendeeInformation = await GetAllAttendeesForConvention(Number(params.conventionId))

  return NextResponse.json<AttendeeCountResponse>({
    total: attendeeInformation.length,
    cancelled: attendeeInformation.filter(a => a.hasCancelled).length,
    checkedIn: attendeeInformation.filter(a => a.checkedInUtc).length,
    volunteers: attendeeInformation.filter(a => a.isTgdOrganizer || a.isVolunteer).length,
    list: attendeeInformation,
  });
}
