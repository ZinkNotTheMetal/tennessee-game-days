import prisma from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { GetPlayToWinReportByConvention } from "./actions"



export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const result = await GetPlayToWinReportByConvention(Number(params.conventionId))

  if (result === null) return NextResponse.json({ message: "Convention not found" }, { status: 404 })
  return NextResponse.json(result)
}
