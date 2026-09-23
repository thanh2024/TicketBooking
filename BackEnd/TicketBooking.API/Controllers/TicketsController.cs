using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "CUSTOMER")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly ICurrentUserService _currentUserService;

    public TicketsController(ITicketService ticketService, ICurrentUserService currentUserService)
    {
        _ticketService = ticketService;
        _currentUserService = currentUserService;
    }

    [HttpGet("my-tickets")]
    public async Task<IActionResult> GetMyTickets()
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _ticketService.GetMyTicketsAsync(userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicketById(Guid id)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _ticketService.GetTicketByIdAsync(id, userId.Value);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }
}
