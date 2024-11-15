import { IBoardGameGeekEntity, IProxyBggApiResponse } from '@repo/board-game-geek-shared'
import { parse as csvParse } from 'csv-parse'
import { Readable } from 'stream'

export function StandardizeGameName(gameName: string): string {
  let result = gameName.trim()
  // Remove quotes from .csv name
  result.replace('"', '')

  // Articles can be at the end (i.e. Deadlines, The)
  if (gameName.toLowerCase().endsWith(", the")) {
    result = "The " + gameName.substring(0, gameName.length - 5)
  }

  return result
}

export async function ParseCsvFile<T>(file: File): Promise<T[]> {
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

export default async function SearchBoardGameGeekProxy(
  query: string,
  searchById: boolean
): Promise<IBoardGameGeekEntity[]> {
  const results: IBoardGameGeekEntity[] = [];

  try {
    const response = await fetch(`${process.env.BGG_PROXY_BASE_API_URL}/search/${query}?searchById=${searchById}`, {
      method: 'GET'
    });

    if (!response.ok) {
      console.error('Error fetching data from BGG Proxy:', response.statusText);
      return results; // Return an empty array if there's an error
    }

    const json: IProxyBggApiResponse[] = await response.json();

    json.forEach((r) => {
      const { name, publishers, maximumPlayingTimeMinutes, minimumPlayingTimeMinutes, votedBestPlayerCounts, ...rest } = r
      const bggEntity: IBoardGameGeekEntity = {
        itemName: name,
        publisherName: publishers[0]?.name ?? '',
        playingTimeMinutes: maximumPlayingTimeMinutes,
        votedBestPlayerCount: votedBestPlayerCounts[0] ?? 0,
        ...rest
      }
      results.push(bggEntity);
    });
  } catch (error) {
    console.error('search-bgg - api search error', error);
  }

  return results;
}
