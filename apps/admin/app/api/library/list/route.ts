import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const libraryCount = await prisma.libraryItem.count();

  const libraryItems = await prisma.libraryItem.findMany({
    include: {
      boardGameGeekThing: true,
    },
  });

  return NextResponse.json({
    total: libraryCount,
    list: libraryItems,
  });
}
