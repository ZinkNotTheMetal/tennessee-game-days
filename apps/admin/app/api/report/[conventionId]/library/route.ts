import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { GetLibraryPlaytimeCounts } from "./actions"

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const conventionForReport = await prisma.convention.findFirst({
    where: { id: Number(params.conventionId) }
  })

  if (conventionForReport === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })
  if (!conventionForReport.startDateTimeUtc) return NextResponse.json({ message: "Convention start date was not found" }, { status: 522 })
  if (!conventionForReport.endDateTimeUtc) return NextResponse.json({ message: "Convention end date was not found" }, { status: 522 })

  const result = await GetLibraryPlaytimeCounts(Number(params.conventionId))
  return NextResponse.json(result, { status: 200 })
}