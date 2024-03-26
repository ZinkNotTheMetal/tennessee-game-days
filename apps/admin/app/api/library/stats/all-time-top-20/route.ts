import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const top20CheckedOutGames = await prisma.libraryItem.findMany({
    where: {
      totalCheckedOutMinutes: {
        gt: 0 // greater than 0
      }
    },
    select: {
      id: true,
      alias: true,
      barcode: true,
      totalCheckedOutMinutes: true,
      boardGameGeekId: true,
      isCheckedOut: true,
      boardGameGeekThing: true,
      _count: { 
        select: { 
          checkOutEvents: true
        }
      }
    },
    orderBy: {
      checkOutEvents: {
        _count: 'desc'
      }
    },
    take: 20 // limit to the top 20 results
  });

  return NextResponse.json({
    list: top20CheckedOutGames,
  }, { status: 200 });
}
