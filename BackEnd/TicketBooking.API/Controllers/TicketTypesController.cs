using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/events/{eventId}/ticket-types")]
[ApiController]
public class TicketTypesController : ControllerBase
{
    private readonly ITicketTypeService _ticketTypeService;

    public TicketTypesController(ITicketTypeService ticketTypeService)
    {
        _ticketTypeService = ticketTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<TicketTypeDto>>>> GetTicketTypes(Guid eventId)
    {
        var response = await _ticketTypeService.GetTicketTypesByEventIdAsync(eventId);
        if (!response.IsSuccess)
            return NotFound(response);
            
        return Ok(response);
    }
}
