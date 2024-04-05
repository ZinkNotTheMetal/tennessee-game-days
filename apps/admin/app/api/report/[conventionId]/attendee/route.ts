import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const attendeeReport = await prisma.attendee.groupBy({
    where: { conventionId: Number(params.conventionId) },
    by: ['isCheckedIn', 'hasCancelled'],
    _count: {
      _all: true
    }
  })

  const counts = {
    allAttendees: 0,
    checkedInAttendees: 0,
    cancelledAttendees: 0,
    notCheckedInAttendees: 0,
  };

  attendeeReport.forEach(report => {
    counts.allAttendees += report._count._all

    if (report.isCheckedIn) {
      counts.checkedInAttendees += report._count._all
    }

    if (report.hasCancelled) {
      counts.cancelledAttendees += report._count._all
    }

    if (!report.isCheckedIn && !report.hasCancelled) {
      counts.notCheckedInAttendees += report._count._all
    }
  })

  return NextResponse.json({
    conventionId: Number(params.conventionId),
    counts
  })

}