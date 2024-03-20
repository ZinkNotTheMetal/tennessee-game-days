import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const conventionCount = await prisma.playToWinItem.count();

  const conventions = await prisma.playToWinItem.findMany({
    include: {
      boardGameGeekThing: true
    }
  });

  return NextResponse.json({
    total: conventionCount,
    list: conventions,
  });
}