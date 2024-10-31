using System.Net.Http.Headers;
using System.Xml.Serialization;
using AutoMapper;
using BoardGameGeek.Proxy.Api.Helpers;
using BoardGameGeek.Proxy.Api.Responses;
using BoardGameGeek.Proxy.Api.Responses.BoardGameGeek;
using Microsoft.AspNetCore.Mvc;

namespace BoardGameGeek.Proxy.Api.Controllers;

[ApiController]
[Route("[controller]")]
[ResponseCache(Duration = 300)]
public class BoardGameGeekController(HttpClient httpClient, IMapper mapper) : ControllerBase
{
    private readonly string _boardGameGeekBaseUrl = "https://www.boardgamegeek.com";
    private readonly string _boardGameGeekSearchEndpoint = "/xmlapi2/search";
    private readonly string _boardGameGeekThingEndpoint = "/xmlapi2/thing";
    
    [HttpGet("/search/{searchTerm}")]
    [ProducesResponseType(typeof(ItemSearchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<string>>> Get(string searchTerm, [FromQuery] bool searchById = false)
    {
        string uriDecodedSearchTerm = Uri.UnescapeDataString(searchTerm);
        XmlSerializer searchSerializer = new XmlSerializer(typeof(BoardGameGeekSearchResponse));
        XmlSerializer thingSerializer = new XmlSerializer(typeof(BoardGameGeekThingResponse));
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));

        string bggIdsToSearch;

        if (!searchById)
        {
            // Query based on the term
            var searchResponse = await httpClient.GetStringAsync(
                $"{_boardGameGeekBaseUrl}{_boardGameGeekSearchEndpoint}?query={uriDecodedSearchTerm}&type=boardgame,boardgameexpansion{(uriDecodedSearchTerm.Contains('"') ? "&exact=1" : "")}");
        
            using StringReader reader = new StringReader(searchResponse.RemoveInvalidXml());
            BoardGameGeekSearchResponse? bggSearchResponse = (BoardGameGeekSearchResponse)searchSerializer.Deserialize(reader)!;

            bggIdsToSearch = string.Join(',', bggSearchResponse.Items.Select(s => s.Id).Distinct().Take(20));
        }
        else
        {
            bggIdsToSearch = searchTerm;
        }
        
        var thingResponse = await httpClient.GetStringAsync(
            $"{_boardGameGeekBaseUrl}{_boardGameGeekThingEndpoint}?id={bggIdsToSearch}&stats=1");
        
        using StringReader thingReader = new StringReader(thingResponse.RemoveInvalidXml());
        BoardGameGeekThingResponse? bggThingResponse =
            (BoardGameGeekThingResponse)thingSerializer.Deserialize(thingReader)!;
        
        return Ok(mapper.Map<List<ItemSearchResponse>>(bggThingResponse.Items));
    }
}