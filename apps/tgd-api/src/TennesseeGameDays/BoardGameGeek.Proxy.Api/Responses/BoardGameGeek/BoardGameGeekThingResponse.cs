using System.Xml.Serialization;

namespace BoardGameGeek.Proxy.Api.Responses.BoardGameGeek;

[XmlRoot("items")]
public class BoardGameGeekThingResponse
{
    [XmlAttribute("termsofuse")]
    public string TermsOfUse { get; set; }
    
    [XmlElement("item")]
    public List<Item> Items { get; set; }
}

public class Item
{
    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("id")]
    public int Id { get; set; }

    [XmlElement("thumbnail")]
    public string? Thumbnail { get; set; }

    [XmlElement("image")]
    public string? Image { get; set; }

    [XmlElement("name")]
    public List<Name> Name { get; set; }
    public string? PrimaryName => Name?.FirstOrDefault(n => n.Type == "primary")?.Value;

    [XmlElement("description")]
    public string? Description { get; set; }
    
    [XmlElement("yearpublished")]
    public YearPublished YearPublished { get; set; }

    [XmlElement("minplayers")]
    public ValueIntAttribute MinPlayers { get; set; }

    [XmlElement("maxplayers")]
    public ValueIntAttribute MaxPlayers { get; set; }
    
    [XmlElement("minage")]
    public ValueIntAttribute MinAge { get; set; }
    
    
    [XmlElement("playingtime")]
    public ValueIntAttribute PlayingTime { get; set; }

    [XmlElement("minplaytime")]
    public ValueIntAttribute MinPlayTime { get; set; }

    [XmlElement("maxplaytime")]
    public ValueIntAttribute MaxPlayTime { get; set; }
    [XmlElement("poll")]
    public List<Poll> Polls { get; set; }

    [XmlElement("poll-summary")]
    public PollSummary PollSummary { get; set; }

    [XmlElement("link")]
    public List<Link> Links { get; set; }

    [XmlElement("statistics")]
    public Statistics Statistics { get; set; }
}



public class Name
{
    [XmlAttribute("type")]
    public string? Type { get; set; }
    
    [XmlIgnore]
    public int? SortIndex { get; set; }

    [XmlElement("sortindex")]
    public string? SortIndexString
    {
        get { return SortIndex?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                SortIndex = null;
            }
            else if (int.TryParse(value, out int result))
            {
                SortIndex = result;
            }
            else
            {
                SortIndex = null;
            }
        }
    }

    [XmlAttribute("value")]
    public string? Value { get; set; }
}

public class ValueDecimalAttribute
{
    [XmlIgnore]
    public decimal? Value { get; set; }

    [XmlAttribute("value")]
    public string? ValueString
    {
        get { return Value?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                Value = null;
            }
            else if (decimal.TryParse(value, out decimal result))
            {
                Value = result;
            }
            else
            {
                Value = null;
            }
        }
    }
}

public class ValueIntAttribute
{
    [XmlIgnore]
    public int? Value { get; set; }

    [XmlAttribute("value")]
    public string? ValueString
    {
        get { return Value?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                Value = null;
            }
            else if (int.TryParse(value, out int result))
            {
                Value = result;
            }
            else
            {
                Value = null;
            }
        }
    }
}

public class Poll
{
    [XmlAttribute("name")]
    public string Name { get; set; }

    [XmlAttribute("title")]
    public string Title { get; set; }
    
    [XmlIgnore]
    public int? TotalVotes { get; set; }

    [XmlElement("totalvotes")]
    public string TotalVotesString
    {
        get { return TotalVotes?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                TotalVotes = null;
            }
            else if (int.TryParse(value, out int result))
            {
                TotalVotes = result;
            }
            else
            {
                TotalVotes = null;
            }
        }
    }

    [XmlElement("results")]
    public List<PollResults> Results { get; set; }
}

public class PollResults
{
    [XmlAttribute("numplayers")]
    public string NumPlayers { get; set; }

    [XmlElement("result")]
    public List<PollResult> Result { get; set; }
}

public class PollResult
{
    [XmlAttribute("value")]
    public string Value { get; set; }
    
    [XmlAttribute("numvotes")]
    public int NumVotes { get; set; }
}

public class PollSummary
{
    [XmlElement("result")]
    public List<PollSummaryResult> Results { get; set; }
}

public class PollSummaryResult
{
    [XmlAttribute("name")]
    public string Name { get; set; }

    [XmlAttribute("value")]
    public string Value { get; set; }
}

public class Time
{
    [XmlIgnore]
    public int? Value { get; set; }

    [XmlAttribute("value")]
    public string? ValueString
    {
        get { return Value?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                Value = null;
            }
            else if (int.TryParse(value, out int result))
            {
                Value = result;
            }
            else
            {
                Value = null;
            }
        }
    }
}

public class Link
{
    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("id")]
    public uint Id { get; set; }

    [XmlAttribute("value")]
    public string Value { get; set; }
}

public class Statistics
{
    [XmlElement("ratings")]
    public Ratings Ratings { get; set; }
}

public class Ratings
{
    [XmlIgnore]
    public int? UsersRated { get; set; }

    [XmlElement("UsersRated")]
    public string? UsersRatedString
    {
        get { return UsersRated?.ToString(); }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                UsersRated = null;
            }
            else if (int.TryParse(value, out int result))
            {
                UsersRated = result;
            }
            else
            {
                UsersRated = null;
            }
        }
    }

    [XmlElement("average")]
    public ValueDecimalAttribute Average { get; set; }

    [XmlElement("averageweight")]
    public ValueDecimalAttribute AverageWeight { get; set; }

    [XmlIgnore]
    public decimal? StdDev { get; set; }

    [XmlElement("stddev")]
    public string? StdDevString
    {
        get { return StdDev.HasValue ? StdDev.Value.ToString() : null; }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                StdDev = null;
            }
            if (decimal.TryParse(value, out decimal result))
            {
                StdDev = result;
            }
            else
            {
                StdDev = null;
            }
        }
    }

    [XmlIgnore]
    public decimal? BayesAverage { get; set; }

    [XmlElement("bayesaverage")]
    public string? BayesAverageString
    {
        get { return BayesAverage.HasValue ? BayesAverage.Value.ToString() : null; }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                BayesAverage = null;
            }
            if (decimal.TryParse(value, out decimal result))
            {
                BayesAverage = result;
            }
            else
            {
                BayesAverage = null;
            }
        }
    }

    [XmlElement("ranks")]
    public Ranks Ranks { get; set; }

    [XmlElement("median")]
    public string? Median { get; set; }

    [XmlElement("owned")]
    public string? Owned { get; set; }

    [XmlElement("trading")]
    public string? Trading { get; set; }

    [XmlElement("wanting")]
    public string? Wanting { get; set; }

    [XmlElement("wishing")]
    public string? Wishing { get; set; }

    [XmlElement("numcomments")]
    public string? NumComments { get; set; }

    [XmlElement("numweights")]
    public string? NumWeights { get; set; }
}

public class Ranks
{
    [XmlElement("rank")]
    public List<Rank> Rank { get; set; }
}

public class Rank
{
    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("id")]
    public int Id { get; set; }

    [XmlAttribute("name")]
    public string Name { get; set; }

    [XmlAttribute("friendlyname")]
    public string FriendlyName { get; set; }
    
    [XmlAttribute("value")]
    public string Value { get; set; }

    [XmlIgnore]
    public decimal? BayesAverage { get; set; }

    [XmlElement("bayesaverage")]
    public string? BayesAverageString
    {
        get { return BayesAverage.HasValue ? BayesAverage.Value.ToString() : null; }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                BayesAverage = null;
            }
            if (decimal.TryParse(value, out decimal result))
            {
                BayesAverage = result;
            }
            else
            {
                BayesAverage = null;
            }
        }
    }
}
