import prisma from "@/app/lib/prisma"

export async function GetAttendeeCounts(conventionId: number) {
  const conventionForReport = await prisma.convention.findUnique({
    where: { id: conventionId }
  })

  if (conventionForReport === null) return null

  const attendeeReport = await prisma.attendee.groupBy({
    where: { conventionId: conventionId },
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

  return counts;
}