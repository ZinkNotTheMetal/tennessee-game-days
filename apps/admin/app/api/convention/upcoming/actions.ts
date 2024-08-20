import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";

async function GetCurrentOrUpcomingConvention() {
  const currentOrUpcomingConvention = await prisma.convention.findFirst({
    where: {
      startDateTimeUtc: {
        not: null,
      },
      // Note: Need to be careful, if the convention ends it will roll over
      endDateTimeUtc: {
        not: null,
        gt: DateTime.utc().toISO(),
      },
    },
    include: {
      venue: true,
    },
    orderBy: {
      startDateTimeUtc: "asc",
    },
  })

  return currentOrUpcomingConvention;
}

async function GetNextUpcomingConvention() {
  const nextUpcomingConvention = await prisma.convention.findFirst({
    where: {
      startDateTimeUtc: {
        not: null
      },
      endDateTimeUtc: {
        not: null,
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

  return nextUpcomingConvention;
}

export { GetCurrentOrUpcomingConvention, GetNextUpcomingConvention}