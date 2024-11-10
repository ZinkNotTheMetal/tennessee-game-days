import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { stringify } from 'csv-stringify/sync'
import { DateTime } from 'ts-luxon'

export async function GET(request: Request) {
  const csvFileName = `tgd_library_${DateTime.utc().month}_${DateTime.utc().day}_${DateTime.utc().year}.csv`

  const columns = ['Barcode', 'Game Name', 'Owner', 'Hidden', 'Times Checked Out', 'Total Checked Out Minutes', 'BGG ID', 'Minimum Player Count', 'Maximum Player Count', 'Best Player Count', 'Average User Rating', 'Complexity Rating'];

  const libraryItems = await prisma.libraryItem.findMany({
    include: {
      checkOutEvents: true,
      boardGameGeekThing: true
    }
  })

  const data = libraryItems.map(libraryItem => ({
    'Barcode': libraryItem.barcode,
    'Game Name': libraryItem.alias ?? libraryItem.boardGameGeekThing.itemName,
    'Owner': libraryItem.owner,
    'Hidden': libraryItem.isHidden ? 'True' : 'False',
    'Times Checked Out': libraryItem.checkOutEvents.length,
    'Total Checked Out Minutes': libraryItem.totalCheckedOutMinutes,
    'BGG ID': libraryItem.boardGameGeekId,
    'Minimum Player Count': libraryItem.boardGameGeekThing.minimumPlayerCount,
    'Maximum Player Count': libraryItem.boardGameGeekThing.maximumPlayerCount,
    'Best Player Count': libraryItem.boardGameGeekThing.votedBestPlayerCount,
    'Average User Rating': Number(libraryItem.boardGameGeekThing.averageUserRating),
    'Complexity Rating': Number(libraryItem.boardGameGeekThing.complexityRating)
  }));

  const csvData = stringify(data, { header: true, columns });

  return new NextResponse(csvData, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${csvFileName}"`,
    }
  })
}