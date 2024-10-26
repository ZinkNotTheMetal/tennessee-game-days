using System;
using System.Collections.Generic;
using System.Xml.Serialization;

[XmlRoot("items")]
public class BoardGameGeekSearchResponse
{
    [XmlAttribute("total")]
    public int Total { get; set; }

    [XmlAttribute("termsofuse")]
    public string TermsOfUse { get; set; }

    [XmlElement("item")]
    public List<SearchBoardGameItem> Items { get; set; }
}

public class SearchBoardGameItem
{
    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("id")]
    public int Id { get; set; }

    [XmlElement("name")]
    public BoardGameName Name { get; set; }

    [XmlElement("yearpublished")]
    public YearPublished YearPublished { get; set; }
}

public class BoardGameName
{
    [XmlAttribute("type")]
    public string Type { get; set; }

    [XmlAttribute("value")]
    public string Value { get; set; }
}

public class YearPublished
{
    [XmlAttribute("value")]
    public int Value { get; set; }
}