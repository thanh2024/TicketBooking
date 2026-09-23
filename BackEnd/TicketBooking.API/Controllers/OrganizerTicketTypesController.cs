using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[ApiController]
[Authorize(Roles = "ORGANIZER")]
public class OrganizerTicketTypesController : ControllerBase
{
    private readonly ITicketTypeService _ticketTypeService;
    private readonly ICurrentUserService _currentUserService;

    public OrganizerTicketTypesController(ITicketTypeService ticketTypeService, ICurrentUserService currentUserService)
    {
        _ticketTypeService = ticketTypeService;
        _currentUserService = currentUserService;
    }

    [HttpPost("api/organizer/events/{eventId}/ticket-types")]
    public async Task<ActionResult<ApiResponse<TicketTypeDto>>> CreateTicketType(Guid eventId, [FromBody] CreateTicketTypeRequest request)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _ticketTypeService.CreateTicketTypeAsync(eventId, request, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Created($"/api/events/{eventId}/ticket-types", response);
    }

    [HttpPut("api/organizer/ticket-types/{id}")]
    public async Task<ActionResult<ApiResponse<TicketTypeDto>>> UpdateTicketType(Guid id, [FromBody] CreateTicketTypeRequest request)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _ticketTypeService.UpdateTicketTypeAsync(id, request, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }

    [HttpDelete("api/organizer/ticket-types/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteTicketType(Guid id)
    {
        var organizerUserId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _ticketTypeService.DeleteTicketTypeAsync(id, organizerUserId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }
}
