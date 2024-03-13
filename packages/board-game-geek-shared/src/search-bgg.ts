import { BggClient } from "boardgamegeekclient";
import { BggThingDto } from "boardgamegeekclient/dist/esm/dto";
import uniqueIdsOnly from "./unique-ids-only";

export async function SearchBoardGameGeek(
  query: string,
  searchById: boolean
): Promise<{ results: BggThingDto[]; totalCount: number }> {
  const bggClient = BggClient.Create();

  if (searchById) {
    try {
      const thingResult = await bggClient.thing.query({ id: Number(query), stats: 1 });
      return {
        results: thingResult,
        totalCount: thingResult.length,
      };
    } catch (error) {
      console.log("Board Game Geek search error:", error);
      throw error;
    }
  } else {
    const searchApiUrl = `https://www.boardgamegeek.com/xmlapi2/search?query=${query.replace('"', "")}&type=boardgame,boardgameexpansion${query.includes('"') ? "&exact=1" : ""}`;
    
    try {
      const response = await fetch(searchApiUrl);
      const stringResponse = await response.text();
      const xmlData = new window.DOMParser().parseFromString(stringResponse, "text/xml");
      const items = xmlData.querySelectorAll("item");
      let queryResultIds: number[] = [];

      if (items.length > 0) {
        items.forEach((i) => {
          queryResultIds.push(Number(i.getAttribute("id")));
        });
      }

      const uniqueIds = queryResultIds.filter(uniqueIdsOnly);

      if (uniqueIds.length === 0) {
        return {
          results: [],
          totalCount: 0,
        };
      } else {
        const gameResults = await bggClient.thing.query({ id: uniqueIds.slice(0, 50), stats: 1 });
        return {
          results: gameResults,
          totalCount: uniqueIds.length,
        };
      }
    } catch (error) {
      console.log("Board Game Geek search error:", error);
      throw error;
    }
  }
}