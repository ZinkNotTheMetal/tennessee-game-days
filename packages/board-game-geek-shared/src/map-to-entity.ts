import { BggThingDto } from "boardgamegeekclient/dist/esm/dto/index";
import type { IBoardGameGeekEntity } from "./entities/IBoardGameGeekEntity";
import FindBoardGameGeekRanking from "./find-bgg-ranking";
import he from "he";
import FindBestPlayerCount from "./find-best-player-count";

export function MapToBoardGameEntity(
  bggThingDto: BggThingDto
): IBoardGameGeekEntity {

  const entity: IBoardGameGeekEntity = {
    id: Number(bggThingDto.id),
    itemName: he.decode(String(bggThingDto.name)).replace(/&quot;/g, '"'),
    description: he
      .decode(bggThingDto.description)
      .replace(/&quot;/g, '"')
      .replace(/&#10;/g, "\n")
      .replace(/&mdash;/g, "—")
      .replace('""', '"')
      .replace(/&ndash;/g, "–")
      .replace(/&shy;/g, "")
      .replace(/&rsquo;/g, "’")
      .replace(/&uuml;/g, "ü")
      .replace(/&#195;/g, "Ã")
      .replace(/&#182;/g, "¶")
      .replace(/&#232;&#138;&#177;&#231;&#129;&#171;;/g, "花火")
      .replace(/&#195;&#169;/g, "é")
      .replace(/&#195;&#182;/g, "ö")
      .replace(/&nbsp;/g, " ")
      .replace(/&hellip;/g, "...")
      .replace(/&trade;/, "™")
      .replace(/&ntilde;/g, "ñ")
      .replace(/&auml;/g, "ä")
      .replace(/&amp;/g, "&")
      .replace(/&ldquo;/g, "“")
      .replace(/&rdquo;/g, "”"),
    type: bggThingDto.type,
    thumbnailUrl: bggThingDto.thumbnail,
    imageUrl: bggThingDto.image,
    yearPublished: bggThingDto.yearpublished,
    playingTimeMinutes: bggThingDto.playingtime,
    minimumPlayerCount: bggThingDto.minplayers,
    maximumPlayerCount: bggThingDto.maxplayers,
    minimumPlayerAge: bggThingDto.minage,
    averageUserRating: bggThingDto.statistics.ratings.average,
    complexityRating: bggThingDto.statistics.ratings.averageweight,
    publisherName: bggThingDto.links.find((item) => item.type === "boardgamepublisher")?.value ?? null,
    ranking: FindBoardGameGeekRanking(
      bggThingDto.statistics.ratings.ranks?.find(
        (item) => item.name == "boardgame"
      )?.value
    ),
    votedBestPlayerCount: FindBestPlayerCount(
      bggThingDto.polls.find((item) => item.name === "suggested_numplayers")
        ?.results
    ),
    mechanics: bggThingDto
      .links?.filter(f => f.type === "boardgamemechanic").map(m => ({
        id: m.id,
        name: m.value
      })) ?? [] as { id: number, name: string }[]
  }

  return entity

}