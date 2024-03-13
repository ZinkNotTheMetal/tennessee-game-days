export default function FindBoardGameGeekRanking(ranking?: string | number): null | number {
  if (ranking === undefined || ranking === "Not Ranked") return null;

  if (Number(ranking)) {
    return Number(ranking);
  } else {
    return null;
  }
}