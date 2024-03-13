import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

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
