import { NextRequest, NextResponse } from "next/server"
import { parse as csvParse } from 'csv-parse'
import { Readable } from 'stream'
import prisma from "@/app/lib/prisma";
import { PlayToWinCsvRow } from "../../requests/ptw-csv-request"
import { MapToBoardGameEntity, SearchBoardGameGeek } from "@repo/board-game-geek-shared";
import { DateTime } from "ts-luxon";

function sleep (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
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
        let ptwAddedId: number = -1

        const bggResult = await SearchBoardGameGeek(ptwItem.gameName, false)

        if (bggResult && bggResult.totalCount > 0) {
          // Some results were found for ptwItem.gameName
          const found = bggResult.results.find((result) => result.name === ptwItem.gameName);

          if (found) {
            // BGG Item is coming back
            const { mechanics, ...bggEntity } = MapToBoardGameEntity(found)
            // Save to BGG Thing
            const upsertBggGame = await prisma.boardGameGeekThing.upsert({
              where: { id: bggEntity.id },
              update: bggEntity,
              create: bggEntity,
            });

            // Add mechanics
            for (const gm of mechanics) {
              await prisma.mechanic.upsert({
                where: { id: gm.id },
                update: { name: gm.name },
                create: {
                  id: gm.id,
                  name: gm.name,
                },
              });
          
              await prisma.gameMechanic.upsert({
                where: {
                  boardGameGeekId_mechanicId: {
                    boardGameGeekId: upsertBggGame.id,
                    mechanicId: gm.id,
                  },
                },
                create: {
                  mechanicId: gm.id,
                  boardGameGeekId: upsertBggGame.id,
                },
                update: {
                  mechanicId: gm.id,
                  boardGameGeekId: upsertBggGame.id,
                },
              });
            }

            // Add to centralized barcode
            const barcodeForPtwItem = await prisma.centralizedBarcode.create({
              data: {
                entityId: 0,
                entityType: "PlayToWinItem",
                barcode: ptwItem.barcode,
              },
            })

            // Add to PTW Games
            const ptwAdded = await prisma.playToWinItem.create({
              data: {
                barcode: ptwItem.barcode,
                isHidden: false,
                conventionId: conventionId,
                gameName: ptwItem.gameName,
                boardGameGeekId: upsertBggGame.id,
                dateAddedUtc: DateTime.utc().toISO(),
              }
            })
            ptwAddedId = ptwAdded.id

            await prisma.centralizedBarcode.update({
              where: { barcode: ptwItem.barcode },
              data: {
                entityId: Number(ptwAdded.id),
              },
            })

          } else {
            // Add to centralized barcode
            await prisma.centralizedBarcode.create({
              data: {
                entityId: 0,
                entityType: "PlayToWinItem",
                barcode: ptwItem.barcode,
              },
            })

            // Add to PTW Games
            const ptwAdded = await prisma.playToWinItem.create({
              data: {
                barcode: ptwItem.barcode,
                isHidden: false,
                conventionId: conventionId,
                gameName: ptwItem.gameName,
                dateAddedUtc: DateTime.utc().toISO(),
              }
            })
            ptwAddedId = ptwAdded.id

            await prisma.centralizedBarcode.update({
              where: { barcode: ptwItem.barcode },
              data: {
                entityId: Number(ptwAdded.id),
              },
            })
          }

        } else {
          // Add to centralized barcode
          await prisma.centralizedBarcode.create({
            data: {
              entityId: 0,
              entityType: "PlayToWinItem",
              barcode: ptwItem.barcode,
            },
          })

          // Add to PTW Games
          const ptwAdded = await prisma.playToWinItem.create({
            data: {
              barcode: ptwItem.barcode,
              isHidden: false,
              conventionId: conventionId,
              gameName: ptwItem.gameName,
              dateAddedUtc: DateTime.utc().toISO(),
            }
          })
          ptwAddedId = ptwAdded.id

          await prisma.centralizedBarcode.update({
            where: { barcode: ptwItem.barcode },
            data: {
              entityId: Number(ptwAdded.id),
            },
          })
        }
        await sleep(1900)
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
