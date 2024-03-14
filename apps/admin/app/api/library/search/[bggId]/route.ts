import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { bggId: string } }) {
  const libraryCountWithBggId = await prisma.libraryItem.count({ where: { boardGameGeekId: Number(params.bggId)} });

  if (libraryCountWithBggId == 0) return NextResponse.json({ total: 0, results: []}, { status: 200 })

  const libraryItemsWithBggId = await prisma.libraryItem.findMany({
    where: { boardGameGeekId: Number(params.bggId) },
  });

  return NextResponse.json({
    total: libraryCountWithBggId,
    list: libraryItemsWithBggId
  });
}