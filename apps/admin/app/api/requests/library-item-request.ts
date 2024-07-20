import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

/**
 * @swagger
 * components:
 *   schemas:
 *    BoardGameGeekThing:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: Board Game Geek Identifier (aka BGGID)
 *        itemName:
 *          type: string
 *          description: Board Game Geek Name
 *        type:
 *          type: string
 *          description: Board Game Geek type
 *          example: BoardGame, Expansion, Accessory
 *        description:
 *          type: string
 *          description: Board Game Geek description
 *        thumbnailUrl:
 *          type: string
 *          description: URL of the Board Game Geek thumbnail
 *        imageUrl:
 *          type: string
 *          description: URL of the Board Game Geek full image
 *        yearPublished:
 *          type: number
 *          format: int32
 *          description: The year published (4 digit year) when the game was published
 *        publisherName:
 *          type: string
 *          nullable: true
 *          description: The name of the publisher who published the game
 *        playingTimeMinutes:
 *          type: number
 *          format: int32
 *          description: The amount of minutes that the game typically takes to play
 *        minimumPlayerCount:
 *          type: number
 *          format: int32
 *          description: The amount of players that it takes to play the game (minimum)
 *        maximumPlayerCount:
 *          type: number
 *          format: int32
 *          description: The most amount of players that it can play in one sitting
 *        minimumPlayerAge:
 *          type: number
 *          format: int32
 *          description: The minimum age recommended to play the game
 *        ranking:
 *          type: number
 *          nullable: true
 *          format: int32
 *          description: The Board Game Geek ranking for the board game
 *        votedBestPlayerCount:
 *          type: number
 *          description: The Board Game Geek voted best amount of players to play the game
 *        averageUserRating:
 *          type: number
 *          description: The average user rating for the game
 *        complexityRating:
 *          type: number
 *          description: The average users vote for how complex the game is
 *        mechanics:
 *          type: array
 *          description: The mechanics of the game (helpful to search against)
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                description: The unique identifier of the mechanic
 *              name:
 *                type: string
 *                description: The name of the mechanic 
 * 
 *    LibraryItemRequest:
 *      type: object
 *      properties:
 *        barcode:
 *          type: string
 *          description: The barcode of the library item
 *        alias:
 *          type: string
 *          nullable: true
 *          description: New name that will show up in library, this is incase that the Library Item doesn't match Board Game Geek
 *        owner:
 *          type: string
 *          description: Name of the owner of the game (set to Library if unsure)
 *        isHidden:
 *          type: boolean
 *          description: Flag to hide the result from the users
 *        additionalBoxContent:
 *          type: array
 *          description: If there are multiple games that are contained within one box, use this to add the BGG ids here so users can search for one or the other
 *          items:
 *             type: number
 *             description: Board Game Geek ID
 *        boardGameGeekId:
 *          type: number
 *          description: Unique identifier in board game geek to link this library item to, this helps provide additional information in the library item
 *        boardGameGeekEntity:
 *          type: object
 *          $ref: '#/components/schemas/BoardGameGeekThing'
 */
interface ILibraryItemRequest {
  barcode: string
  alias: string | null
  owner: string
  isHidden: boolean
  additionalBoxContent: number[]
  boardGameGeekId: number
  boardGameGeekThing: IBoardGameGeekEntity
}

export default ILibraryItemRequest