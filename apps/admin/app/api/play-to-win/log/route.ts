import prisma from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { DateTime } from "ts-luxon";

interface PlayToWinLogRequest {
  attendeeId: number
  playToWinItemId: number
}

export async function POST(request: NextRequest) {
  const data: PlayToWinLogRequest[] = await request.json()

  const loggedTime = DateTime.utc().toISO()

  const requestsWithDate = data.map((each) => ({
    ...each,
    checkedInTimeUtcIso: loggedTime,
  }));

  // Add prisma for each ptw game
}