export function FormatBoardGameGeekType(type: string): string {
  switch (type) {
    case "boardgame":
      return "Board Game"
    case "accessory":
      return "Accessory"
    case "boardgameexpansion":
      return "Expansion"
    default:
      return type
  }
}