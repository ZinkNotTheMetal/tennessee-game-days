import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
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

  const [cancelledCount, nonCancelledCount, checkedInCount, attendees] = await Promise.all([
    prisma.attendee.count({
      where: {
        AND: [
          { 
            hasCancelled: true,
          },
          {
            conventionId: Number(params.conventionId)
          }
        ]
      }
    }),
    prisma.attendee.count({
      where: {
        AND: [
          { 
            hasCancelled: false,
          },
          {
            conventionId: Number(params.conventionId)
          }
        ]
      }
    }),
    prisma.attendee.count({
      where: {
        AND: [
          {
            isCheckedIn: true
          },
          {
            conventionId: Number(params.conventionId)
          }
        ]
      }
    }),
    GetAllAttendeesForConvention(Number(params.conventionId))
  ])

  return NextResponse.json<AttendeeCountResponse>({
    total: cancelledCount + nonCancelledCount,
    cancelled: cancelledCount,
    checkedIn: checkedInCount,
    list: attendees,
  });
}
