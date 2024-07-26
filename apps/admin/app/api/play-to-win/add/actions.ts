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