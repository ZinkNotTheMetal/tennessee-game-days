using AutoMapper;
using TennesseeGameDays.API.Entities;
using TennesseeGameDays.API.Responses;
using TennesseeGameDays.API.Responses.BoardGameGeek;

namespace TennesseeGameDays.API.MappingProfiles;

public class BoardGameGeekMappingProfile : Profile
{
    public BoardGameGeekMappingProfile()
    {
        CreateMap<Item, ItemSearchResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.PrimaryName))
            .ForMember(dest => dest.Description,
                opt => opt.MapFrom(src => DecodeAndReplaceHtmlEntities(src.Description)))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.ThumbnailUrl, options => options.MapFrom(src => src.Thumbnail))
            .ForMember(dest => dest.ImageUrl, options => options.MapFrom(src => src.Image))
            .ForMember(dest => dest.YearPublished, opt => opt.MapFrom(src => Convert.ToUInt32(src.YearPublished.Value)))
            .ForMember(dest => dest.MinimumPlayerCount,
                opt => opt.MapFrom(src => Convert.ToUInt32(src.MinPlayers.Value)))
            .ForMember(dest => dest.MaximumPlayerCount, opt => opt.MapFrom(src => src.MaxPlayers.Value))
            .ForMember(dest => dest.MinimumPlayerAge, opt => opt.MapFrom(src => Convert.ToUInt32(src.MinAge.Value)))
            .ForMember(dest => dest.MinimumPlayingTimeMinutes,
                opt => opt.MapFrom(src => Convert.ToUInt32(src.MinPlayTime.Value)))
            .ForMember(dest => dest.MaximumPlayingTimeMinutes,
                opt => opt.MapFrom(src => Convert.ToUInt32(src.MaxPlayTime.Value)))
            .ForMember(dest => dest.AverageUserRating, opt => opt.MapFrom(src => src.Statistics.Ratings.Average.Value))
            .ForMember(dest => dest.ComplexityRating,
                opt => opt.MapFrom(src => src.Statistics.Ratings.AverageWeight.Value))
            .ForMember(dest => dest.Publishers, opt => opt.MapFrom(src =>
                src.Links.Where(link => link.Type == "boardgamepublisher")
                    .Select(s => new GamePublisher { Id = s.Id, Name = s.Value })
                    .ToList() ?? new List<GamePublisher>()))
            .ForMember(dest => dest.Ranking, opt => opt.MapFrom(src =>
                GetBoardGameGeekRank(src.Statistics.Ratings.Ranks.Rank
                    .FirstOrDefault(r => r.FriendlyName == "Board Game Rank").Value)))
            .ForMember(dest => dest.VotedBestPlayerCounts, opt => opt.MapFrom<BestPlayerCountResolver>())
            .ForMember(dest => dest.Mechanics, opt => opt.MapFrom(src => 
                src.Links.Where(l => l.Type == "boardgamemechanic")
                    .Select(s => new GameMechanic { Id = s.Id, Name = s.Value })
                    .ToList() ?? new List<GameMechanic>()))
            ;
        
        
        // votedBestPlayerCount: FindBestPlayerCount(
        //     bggThingDto.polls.find((item) => item.name === "suggested_numplayers")
        //         ?.results
        // ),
        
        //  if (pollResults == null || pollResults.length === 0) return bestPlayerCount;

        // pollResults.forEach((poll) => {
        //   if (poll.resultItemList == null || poll.resultItemList.length === 0)
        //     return 0;

        //   poll.resultItemList.forEach((item) => {
        //     if (item.value === "Best") {
        //       const bestItemVotePerPlayer = item.numvotes ?? 0;

        //       if (bestItemVotePerPlayer > highestBestVotes) {
        //         highestBestVotes = bestItemVotePerPlayer;
        //         bestPlayerCount = Number(poll.numplayers);
        //       }
        //     }
        //   });
        // });
    }
    
    private string DecodeAndReplaceHtmlEntities(string? description)
    {
        if (string.IsNullOrEmpty(description))
            return string.Empty;

        var decodedDescription = System.Net.WebUtility.HtmlDecode(description);
        
        // Replace specific entities as needed
        decodedDescription = decodedDescription
            .Replace("&quot;", "\"")
            .Replace("&#10;", "\n")
            .Replace("&mdash;", "—")
            .Replace("\"\"", "\"")
            .Replace("&ndash;", "–")
            .Replace("&shy;", "")
            .Replace("&rsquo;", "’")
            .Replace("&uuml;", "ü")
            .Replace("&#195;", "Ã")
            .Replace("&#182;", "¶")
            .Replace("&#232;&#138;&#177;&#231;&#129;&#171;;", "花火")
            .Replace("&#195;&#169;", "é")
            .Replace("&#195;&#182;", "ö")
            .Replace("&nbsp;", " ")
            .Replace("&hellip;", "...")
            .Replace("&trade;", "™")
            .Replace("&ntilde;", "ñ")
            .Replace("&auml;", "ä")
            .Replace("&amp;", "&")
            .Replace("&ldquo;", "“")
            .Replace("&rdquo;", "”");

        return decodedDescription;
    }

    internal static uint? GetBoardGameGeekRank(string? rankValue)
    {
        if (string.IsNullOrEmpty(rankValue) || rankValue.Equals("Not Ranked", StringComparison.InvariantCultureIgnoreCase))
        {
            return (uint?) null;  // Return null if no rank or if rank is "Not Ranked"
        }

        // Try to convert the rank to uint if it is numeric
        return uint.TryParse(rankValue, out uint result) ? result : (uint?)null;
    }
}