import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";

export async function PATCH(request: NextRequest, { params }: { params: { attendeeId: string }}) {

  const attendee = await prisma.attendee.findFirst({
    where: { id: Number(params.attendeeId)}
  })

  if (attendee === null) return NextResponse.json({ error: "Unable to find attendee in the system for this convention" }, { status: 404 })

  await prisma.attendee.update({
    where: { id: Number(params.attendeeId) },
    data: {
      checkedInUtc: DateTime.utc().toISO(),
      isCheckedIn: true
    }
  })

  return NextResponse.json(
    {
      message: "Successfully checked in attendee to conference",
    },
    { status: 200 }
  );
}