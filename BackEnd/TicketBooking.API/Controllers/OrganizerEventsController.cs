using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/organizer/events")]
[ApiController]
[Authorize(Roles = "ORGANIZER")]
public class OrganizerEventsController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IOrderService _orderService;
    private readonly ICurrentUserService _currentUserService;

    public OrganizerEventsController(IEventService eventService, IOrderService orderService, ICurrentUserService currentUserService)
    {
        _eventService = eventService;
        _orderService = orderService;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<EventListDto>>>> GetEvents()
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _eventService.GetOrganizerEventsAsync(organizerUserId);
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<EventDetailDto>>> CreateEvent([FromBody] CreateEventRequest request)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _eventService.CreateEventAsync(request, organizerUserId);
        
        if (!response.IsSuccess)
            return BadRequest(response);

        // Since it's a new sub-route, we can just return Ok or Created
        return Created($"/api/events/{response.Data?.Id}", response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EventDetailDto>>> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _eventService.UpdateEventAsync(id, request, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteEvent(Guid id)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _eventService.DeleteEventAsync(id, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<ApiResponse<string>>> SubmitEvent(Guid id)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _eventService.SubmitEventAsync(id, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }

    [HttpGet("orders")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<OrderDto>>>> GetOrganizerOrders([FromQuery] Guid? eventId)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _orderService.GetOrganizerOrdersAsync(organizerUserId, eventId);
        
        if (!response.IsSuccess)
            return BadRequest(response);

        return Ok(response);
    }
}
