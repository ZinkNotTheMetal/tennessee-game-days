import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     Top20LibraryItemResult:
 *       type: object
 *       properties:
 *         bggId:
 *           type: number
 *           description: Board Game Geek Id
 *         libraryItemName:
 *           type: string
 *           description: Name of the library item found
 *         allCopiesCheckedOut:
 *           type: boolean
 *           description: Flag that says if all copies of the game being searched are checked out
 *         totalCheckedOutMinutes:
 *           type: number
 *           description: Total number of minutes game has been checked out
 *         totalCheckedOutEvents:
 *           type: number
 *           description: Total number of times the game has been checked out
 *         bggAverageRating:
 *           type: number
 *           description: Board Game Geek Rating
 *         bggAverageComplexity:
 *           type: number
 *           description: Board Game Geek rated complexity
 *         minPlayerCount:
 *           type: number
 *           description: Minimum amount of players per game required to play
 *         maxPlayerCount:
 *           type: number
 *           description: Maximum amount of players per game allowed to play
 *         bggPlaytimeMinutes:
 *           type: number
 *           description: Amount of minutes played by the Board Game Geek community
 * 
 */
export interface Top20LibraryItemResult {
  bggId: string
  libraryItemName: string
  allCopiesCheckedOut: boolean
  totalCheckedOutMinutes: string
  totalCheckedOutEvents: string
  bggAverageRating: number
  bggAverageComplexity: number
  minPlayerCount: number
  maxPlayerCount: number
  bggPlaytimeMinutes: number
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Top20LibraryListResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total amount of Conventions
 *         list:
 *           type: array
 *           description: Top 20 Games checked out (limited to 20 results)
 *           items:
 *             $ref: '#/components/schemas/Top20LibraryItemResult'
 */
export interface Top20LibraryListResponse {
  list: Top20LibraryItemResult[]
}