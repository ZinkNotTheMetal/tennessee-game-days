import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayToWinRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the play to win item
 *         barcode:
 *           type: number
 *           description: The unique barcode for the play to win item
 *         gameName:
 *           type: string
 *           description: The name of the item for the play to win item
 *         publisherName:
 *           type: string
 *           description: The name of the publisher (this will be used for reports)
 *         isHidden:
 *           type: boolean
 *           description: Flag to hide play to win items from users
 *         _count:
 *           type: object
 *           properties:
 *             playToWinPlays:
 *               type: number
 *         boardGameGeekId:
 *           type: number
 *           description: The unique identifier for the board game geek item
 *         boardGameGeekThing:
 *           $ref: '#/components/schemas/BoardGameGeekThing'
 */
interface IPlayToWinRequest {
  id: number,
  barcode: string
  gameName: string
  publisherName: string
  isHidden: boolean
  _count: { playToWinPlays: number }
  boardGameGeekId: number
  boardGameGeekThing: IBoardGameGeekEntity
}

export type { IPlayToWinRequest }