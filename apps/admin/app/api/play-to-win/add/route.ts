import { NextRequest, NextResponse } from "next/server"
import { parse as csvParse } from 'csv-parse'
import { Readable } from 'stream'
import prisma from "@/app/lib/prisma";
import { PlayToWinCsvRow } from "../../requests/ptw-csv-request"
import { DateTime } from "ts-luxon";


// https://stackoverflow.com/questions/73839916/how-to-run-functions-that-take-more-than-10s-on-vercel
// https://vercel.com/docs/functions/runtimes#max-execution-time
export const maxDuration = 10; // 10 seconds

function standardizeGameName(gameName: string): string {
  let result = gameName.trim()
  // Remove quotes from .csv name
  result.replace('"', '')

  // Articles can be at the end (i.e. Deadlines, The)
  if (gameName.toLowerCase().endsWith(", the")) {
    result = "The " + gameName.substring(0, gameName.length - 5)
  }

  return result
}

export async function POST(request: NextRequest) {

  const formData = await request.formData()
  const file = formData.get('csvFile') as File
  const conventionId = Number(formData.get('conventionId')?.toString())

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  } else {

    try {
      const results = await parseCsvFile<PlayToWinCsvRow>(file)

      for(const ptwItem of results) {
        // Add barcode
        await prisma.centralizedBarcode.create({
          data: {
            entityId: 0,
            entityType: "PlayToWinItem",
            barcode: ptwItem.barcode,
          },
        })

        const gameName = standardizeGameName(ptwItem.gameName)

        // Add to PTW Games
        const ptwAdded = await prisma.playToWinItem.create({
          data: {
            barcode: ptwItem.barcode,
            isHidden: false,
            conventionId: conventionId,
            gameName: gameName,
            publisherName: ptwItem.publisher || null,
            dateAddedUtc: DateTime.utc().toISO(),
          }
        })
        
        // Update barcode
        await prisma.centralizedBarcode.update({
          where: { barcode: ptwItem.barcode },
          data: {
            entityId: Number(ptwAdded.id),
          },
        })
      }

    } catch (error) {
      console.log('Error parsing CSV fle:', error)
      return NextResponse.json({
        error: 'Error parsing CSV file',
        },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    {
      message: "Successfully added games to play-to-win",
    },
    { status: 201 }
  );

}

async function parseCsvFile<T>(file: File): Promise<T[]> {
  const results: T[] = [];
  const stream = new Readable();
  stream.push(Buffer.from(await file.arrayBuffer()));
  stream.push(null);

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParse({
        columns: true,
        skipRecordsWithError: true,
        skipRecordsWithEmptyValues: true,
        skipEmptyLines: true,
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
