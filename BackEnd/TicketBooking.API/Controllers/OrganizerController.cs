using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Organizers;
using TicketBooking.Application.DTOs.Tickets;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizerController : ControllerBase
{
    private readonly IOrganizerService _organizerService;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITicketService _ticketService;

    public OrganizerController(IOrganizerService organizerService, ICurrentUserService currentUserService, ITicketService ticketService)
    {
        _organizerService = organizerService;
        _currentUserService = currentUserService;
        _ticketService = ticketService;
    }

    [HttpPost("register")]
    [Authorize]
    public async Task<IActionResult> RegisterOrganizer([FromBody] RegisterOrganizerRequest request)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.RegisterOrganizerAsync(userId.Value, request);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("profile")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.GetProfileAsync(userId.Value);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPut("profile")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateOrganizerRequest request)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.UpdateOrganizerAsync(userId.Value, request);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("dashboard")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.GetDashboardAsync(userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("events/statistics")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> GetEventStatistics()
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.GetEventStatisticsAsync(userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("revenue")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> GetRevenue()
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _organizerService.GetRevenueAsync(userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("tickets/check-in")]
    [Authorize(Roles = "ORGANIZER")]
    public async Task<IActionResult> CheckIn([FromBody] CheckInRequest request)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();
        if (string.IsNullOrWhiteSpace(request.TicketCode))
            return BadRequest(new { message = "Ticket code is required" });

        var response = await _ticketService.CheckInAsync(request.TicketCode.Trim(), userId.Value);
        // Always return 200 so frontend can read the data even on error cases (USED ticket etc.)
        return Ok(response);
    }
}
