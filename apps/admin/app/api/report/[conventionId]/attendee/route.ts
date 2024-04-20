import { NextRequest, NextResponse } from "next/server"
import { GetAttendeeCounts } from "./actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {
  const counts = await GetAttendeeCounts(Number(params.conventionId))

  if (counts === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })

  return NextResponse.json({
    conventionId: Number(params.conventionId),
    counts
  })

}