namespace TennesseeGameDays.API.Entities;

public class PlayToWinItem
{
    public uint Id { get; set; }
    public uint BoardGameGeekId { get; set; }
    public string Name { get; set; }
    public bool IsHidden { get; set; }
    public string Barcode { get; set; }
    public List<GamePublisher> Publishers { get; set; }
    public DateTime DateAddedUtc { get; set; }
}