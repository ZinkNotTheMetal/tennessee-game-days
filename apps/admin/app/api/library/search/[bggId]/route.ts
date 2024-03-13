import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { bggId: string } }) {
  try {
    const libraryCountWithBggId = await prisma.libraryItem.count({ where: { boardGameGeekThingId: Number(params.bggId)} });

    if (libraryCountWithBggId == 0) return NextResponse.json({ total: 0, results: []}, { status: 200 })

    const libraryItemsWithBggId = await prisma.libraryItem.findMany({
      where: { boardGameGeekThingId: Number(params.bggId) },
    });

    return NextResponse.json({
      total: libraryCountWithBggId,
      list: libraryItemsWithBggId
    });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}