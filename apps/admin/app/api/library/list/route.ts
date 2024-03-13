import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
