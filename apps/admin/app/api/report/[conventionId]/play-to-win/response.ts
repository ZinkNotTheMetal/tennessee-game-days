import { Decimal } from "@prisma/client/runtime/library"

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayToWinReportResponse:
 *       type: object
 *       properties:
 *         gameName:
 *           type: string
 *           nullable: true
 *           description: The name of the game
 *         publisher:
 *           type: string
 *           nullable: true
 *           description: The publisher of the game
 *         totalPlays:
 *           type: number
 *           description: The total number of plays
 *         totalPlayerCount:
 *           type: number
 *           description: The total number of players
 *         bggUserRating:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           description: The user rating on BoardGameGeek
 *         bggComplexityRating:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           description: The complexity rating on BoardGameGeek
 */
export interface PlayToWinReportResponse {
  gameName: string | null
  publisher: string | null
  totalPlays: number
  totalPlayerCount: number
  bggUserRating: Decimal | null | undefined
  bggComplexityRating: Decimal | null | undefined
}