import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { conventionId: string } }
) {

  const result = await prisma.playToWinPlay.aggregate({
    _count: {
      _all: true,
    },
    groupBy: { gameName: { playToWinItem: { name: true } } },
  });

  return NextResponse.json({
    result
  })
}


// id                 Int                 @id @default(autoincrement()) @map(name: "id")
// barcode            String              @map(name: "barcode")
// boardGameGeekId    Int?                @map(name: "bgg_id")
// boardGameGeekThing BoardGameGeekThing? @relation(fields: [boardGameGeekId], references: [id])
// gameName           String?             @map(name: "game_name")
// conventionId       Int                 @map(name: "convention_id")
// convention         Convention          @relation(fields: [conventionId], references: [id])
// isHidden           Boolean             @map(name: "is_hidden")
// totalTimesPlayed   Int                 @default(0) @map(name: "total_played")
// publisherName      String?             @map(name: "publisher")
// dateAddedUtc       String              @map(name: "date_added_utc")
// centralizedBarcode CentralizedBarcode  @relation(fields: [barcode], references: [barcode])

// playToWinPlays     PlayToWinPlay[]

// // is_checked_out?
// @@unique([barcode])
// @@map("play_to_win_items")


// model PlayToWinPlay {
//   id                        String        @id @default(cuid()) @map(name: "id")
//   playToWinItemId           Int           @map(name: "play_to_win_item_id")
//   playToWinItem             PlayToWinItem @relation(fields: [playToWinItemId], references: [id])
//   checkedInTimeUtcIso       String        @map("checked_in_time_utc")
//   conventionId              Int           @map("convention_id")
//   convention                Convention    @relation(fields: [conventionId], references: [id])

//   playToWinPlayAttendees    PlayToWinPlayAttendee[]

//   @@map("play_to_win_plays")
// }

// model PlayToWinPlayAttendee {
//   id                        String        @id @default(cuid()) @map(name: "id")
//   playToWinItemId           String        @map(name: "play_to_win_play_id")
//   playToWinPlay             PlayToWinPlay @relation(fields: [playToWinItemId], references: [id])
//   attendeeId                Int           @map(name: "attendee_id")
//   attendee                  Attendee      @relation(fields: [attendeeId], references: [id])

//   @@map("play_to_win_play_players")
// }
