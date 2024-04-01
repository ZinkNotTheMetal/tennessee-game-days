import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const conventionCount = await prisma.playToWinItem.count({
    where: {
      conventionId: Number(params.conventionId)
    }
  });

  const conventions = await prisma.playToWinItem.findMany({
    where: {
      conventionId: Number(params.conventionId)
    },
    include: {
      boardGameGeekThing: true
    }
  });

  return NextResponse.json({
    total: conventionCount,
    list: conventions,
  });
}