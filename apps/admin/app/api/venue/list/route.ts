import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const venueCount = await prisma.venue.count();

  const venues = await prisma.venue.findMany();

  return NextResponse.json({
    total: venueCount,
    list: venues,
  });
}
