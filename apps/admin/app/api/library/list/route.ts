import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetAllLibraryItems } from "./actions"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function GET() {

  const [count, items] = await Promise.all([
    prisma.libraryItem.count(),
    GetAllLibraryItems
  ])

  return NextResponse.json({
    total: count,
    list: items,
  });
}
