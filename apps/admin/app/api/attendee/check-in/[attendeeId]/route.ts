import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";

/**
 * @swagger
 * /api/attendee/check-in/{attendeeId}:
 *   patch:
 *     tags:
 *       - Convention
 *       - Attendee
 *     summary: Checks in an attendee at the conference to mark them as attended
 *     description: Checks in an attendee at the conference to mark them as attended
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of an attendee
 *     responses:
 *       200:
 *         description: Attendee successfully checked in
 *         content:
 *           application/json:
 *             schema:
 *               message: string
 *       404:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */

export async function PATCH(request: Request, { params }: { params: Promise<{ attendeeId: string }> }) {
  const attendeeId = (await params).attendeeId

  const attendee = await prisma.attendee.findFirst({
    where: { id: Number(attendeeId)}
  })

  if (attendee === null) return NextResponse.json({ error: "Unable to find attendee in the system for this convention" }, { status: 404 })

  await prisma.attendee.update({
    where: { id: Number(attendeeId) },
    data: {
      checkedInUtc: DateTime.utc().toISO(),
      isCheckedIn: true
    }
  })

  revalidateTag('scanner')

  return NextResponse.json(
    {
      message: "Successfully checked in attendee to conference",
    },
    { status: 200 }
  );
}