import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetAllConventions } from "./actions"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {
  const [count, conventions] = await Promise.all([
    prisma.convention.count(),
    GetAllConventions()
  ])

  return NextResponse.json({
    total: count,
    list: conventions,
  })
}
