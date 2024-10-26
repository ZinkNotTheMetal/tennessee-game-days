using Microsoft.AspNetCore.Mvc;

namespace TennesseeGameDays.API.Controllers;

[ApiController]
[Route("[controller]")]
public class PlayToWinGamesController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(string conventionId)
    {
        // Get All PTW games 
        return Ok();
    }
    
    // Hide PTW game (if needed)
    
    // Get Item By ID
    
    // Add
    
    // Delete
    
    // Do Board Game Geek update
}