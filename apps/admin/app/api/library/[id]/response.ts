import { Decimal } from "@prisma/client/runtime/library";

interface Mechanic {
  id: number;
  name: string;
}

interface BoardGameGeekThing {
  id: number;
  itemName: string;
  type: string;
  description: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  yearPublished: number | null;
  publisherName: string | null;
  playingTimeMinutes: number | null;
  minimumPlayerCount: number | null;
  maximumPlayerCount: number | null;
  minimumPlayerAge: number | null;
  ranking: number | null;
  votedBestPlayerCount: number | null;
  averageUserRating: Decimal | null;
  complexityRating: Decimal | null;
  mechanics: Mechanic[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Mechanic:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the mechanic
 *         name:
 *           type: string
 *           description: Name of the mechanic
 *     BoardGameGeekThing:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the BoardGameGeek thing
 *         itemName:
 *           type: string
 *           description: Name of the item
 *         type:
 *           type: string
 *           description: Type of the item (e.g., boardgame)
 *         description:
 *           type: string
 *           description: Description of the item
 *         thumbnailUrl:
 *           type: string
 *           description: URL of the thumbnail image
 *         imageUrl:
 *           type: string
 *           description: URL of the image
 *         yearPublished:
 *           type: number
 *           description: Year the item was published
 *         publisherName:
 *           type: string
 *           description: Name of the publisher
 *         playingTimeMinutes:
 *           type: number
 *           description: Playing time in minutes
 *         minimumPlayerCount:
 *           type: number
 *           description: Minimum number of players
 *         maximumPlayerCount:
 *           type: number
 *           description: Maximum number of players
 *         minimumPlayerAge:
 *           type: number
 *           description: Minimum player age
 *         ranking:
 *           type: number
 *           description: Ranking of the item
 *         votedBestPlayerCount:
 *           type: number
 *           description: Best player count as voted by users
 *         averageUserRating:
 *           type: string
 *           description: Average user rating
 *         complexityRating:
 *           type: string
 *           description: Complexity rating
 *         mechanics:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Mechanic'
 *     LibraryItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the library item
 *         boardGameGeekId:
 *           type: number
 *           description: BoardGameGeek ID of the item
 *         barcode:
 *           type: string
 *           description: Barcode of the item
 *         alias:
 *           type: string
 *           nullable: true
 *           description: Alias of the item
 *         owner:
 *           type: string
 *           description: Owner of the item
 *         isHidden:
 *           type: boolean
 *           description: Is the item hidden
 *         isCheckedOut:
 *           type: boolean
 *           description: Is the item checked out
 *         totalCheckedOutMinutes:
 *           type: number
 *           description: Total minutes the item has been checked out
 *         dateAddedUtc:
 *           type: string
 *           format: date-time
 *           description: Date the item was added (in UTC)
 *         updatedAtUtc:
 *           type: string
 *           format: date-time
 *           description: Date the item was last updated (in UTC)
 *         additionalBoxContent:
 *           type: array
 *           items:
 *             type: object
 *           description: Additional content in the box
 *         checkOutEvents:
 *           type: array
 *           items:
 *             type: object
 *           description: Checkout events for the item
 *         boardGameGeekThing:
 *           $ref: '#/components/schemas/BoardGameGeekThing'
 */
interface LibraryItem {
  id: number;
  boardGameGeekId: number;
  barcode: string;
  alias: string | null;
  owner: string;
  isHidden: boolean;
  isCheckedOut: boolean;
  totalCheckedOutMinutes: number;
  dateAddedUtc: Date;
  updatedAtUtc: Date;
  additionalBoxContent: any[];
  checkOutEvents: any[];
  boardGameGeekThing: BoardGameGeekThing;
}
