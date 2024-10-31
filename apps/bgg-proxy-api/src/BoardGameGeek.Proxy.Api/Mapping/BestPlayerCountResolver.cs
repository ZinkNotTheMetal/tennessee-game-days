using AutoMapper;
using BoardGameGeek.Proxy.Api.Responses;
using BoardGameGeek.Proxy.Api.Responses.BoardGameGeek;

namespace BoardGameGeek.Proxy.Api.Mapping;

public class BestPlayerCountResolver : IValueResolver<Item, GameSearchResponse, List<uint>>
{
    private const string SuggestedNumberOfPlayerPollName = "suggested_numplayers";
    private const string BestRecommendationPollName = "Best";
    
    public List<uint> Resolve(Item source, GameSearchResponse destination, List<uint> destMember, ResolutionContext context)
    {
        var result = new List<uint>();
        uint highestBestVotes = 0;
        
        // Get the poll result if it doesn't exist then return [];
        var suggestedNumberOfPlayersPoll = source.Polls.FirstOrDefault(p => p.Name == SuggestedNumberOfPlayerPollName);
        if (suggestedNumberOfPlayersPoll == null) return [];

        foreach (var suggestedNumberOfPlayers in suggestedNumberOfPlayersPoll.Results)
        {
            if (suggestedNumberOfPlayers.Result.FirstOrDefault() == null) continue;

            if (uint.TryParse(suggestedNumberOfPlayers.NumPlayers, out var playerCount))
            {
                var currentBestCount = Convert.ToUInt32(suggestedNumberOfPlayers.Result.FirstOrDefault(v => v.Value == BestRecommendationPollName)?.NumVotes);
                
                if (currentBestCount > highestBestVotes && currentBestCount != 0)
                {
                    result = [playerCount];
                    highestBestVotes = currentBestCount;
                }
                else if (currentBestCount == highestBestVotes && currentBestCount != 0)
                {
                    result.Add(playerCount);
                }
            };
        }

        return result;
    }
}