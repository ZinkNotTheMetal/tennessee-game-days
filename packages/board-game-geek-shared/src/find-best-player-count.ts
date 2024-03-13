import { BggPollResultDto } from "boardgamegeekclient/dist/esm/dto/concrete/subdto/BggPollResultDto";

export default function FindBestPlayerCount(pollResults?: BggPollResultDto[]): number {
  let highestBestVotes = 0;
  let bestPlayerCount: number = 0;

  if (pollResults == null || pollResults.length === 0) return bestPlayerCount;

  pollResults.forEach((poll) => {
    if (poll.resultItemList == null || poll.resultItemList.length === 0)
      return 0;

    poll.resultItemList.forEach((item) => {
      if (item.value === "Best") {
        const bestItemVotePerPlayer = item.numvotes ?? 0;

        if (bestItemVotePerPlayer > highestBestVotes) {
          highestBestVotes = bestItemVotePerPlayer;
          bestPlayerCount = Number(poll.numplayers);
        }
      }
    });
  });

  return bestPlayerCount;
}