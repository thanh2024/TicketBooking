using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<EventListDto>>>> GetEvents([FromQuery] EventFilterRequest filter)
    {
        var response = await _eventService.GetEventsAsync(filter);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EventDetailDto>>> GetEventById(Guid id)
    {
        var response = await _eventService.GetEventByIdAsync(id);
        if (!response.IsSuccess)
            return NotFound(response);
            
        return Ok(response);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<EventListDto>>>> GetFeaturedEvents([FromQuery] int count = 5)
    {
        var response = await _eventService.GetFeaturedEventsAsync(count);
        return Ok(response);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<EventListDto>>>> GetUpcomingEvents([FromQuery] int count = 5)
    {
        var response = await _eventService.GetUpcomingEventsAsync(count);
        return Ok(response);
    }
}
