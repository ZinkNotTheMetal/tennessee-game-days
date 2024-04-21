import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetAllAttendeesForConvention } from "./actions"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET(request: NextRequest, { params }: { params: { conventionId: string }}) {

  const [cancelledCount, attendeeCount, attendees] = await Promise.all([
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
    GetAllAttendeesForConvention(Number(params.conventionId))
  ])

  return NextResponse.json({
    total: attendeeCount,
    cancelled: cancelledCount,
    list: attendees,
  });
}
