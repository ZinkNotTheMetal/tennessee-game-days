namespace BoardGameGeek.Proxy.Api.Responses;

public class GameSearchResponse
{
    public ulong Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ImageUrl { get; set; }
    public uint? YearPublished { get; set; }
    public uint? MinimumPlayerCount { get; set; }
    public uint? MaximumPlayerCount { get; set; }
    public decimal? MinimumPlayingTimeMinutes { get; set; }
    public decimal? MaximumPlayingTimeMinutes { get; set; }
    public uint? MinimumPlayerAge { get; set; }
    public decimal? AverageUserRating { get; set; }
    public decimal? ComplexityRating { get; set; }
    public uint? Ranking { get; set; }
    public List<uint> VotedBestPlayerCounts { get; set; } = [];
    public List<GamePublisher> Publishers { get; set; } = [];
    public List<GameMechanic> Mechanics { get; set; } = [];
}

public class GamePublisher
{
    public uint Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class GameMechanic
{
    public uint Id { get; set; }
    public string Name { get; set; } = string.Empty;
}