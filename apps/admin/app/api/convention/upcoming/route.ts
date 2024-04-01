import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const nextUpcomingConvention = await prisma.convention.findFirst({
    where: {
      endDateTimeUtc: {
        gt: DateTime.utc().toISO()
      }
    },
    include: {
      venue: true
    },
    orderBy: {
      startDateTimeUtc: 'asc'
    }
  })

  return NextResponse.json(
    nextUpcomingConvention
  )
}
