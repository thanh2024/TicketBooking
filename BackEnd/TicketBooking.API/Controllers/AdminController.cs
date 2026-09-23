using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var response = await _adminService.GetDashboardAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var response = await _adminService.GetUsersAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPut("users/{id}/lock")]
    public async Task<IActionResult> LockUser(Guid id)
    {
        var response = await _adminService.LockUserAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPut("users/{id}/unlock")]
    public async Task<IActionResult> UnlockUser(Guid id)
    {
        var response = await _adminService.UnlockUserAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpGet("organizers/pending")]
    public async Task<IActionResult> GetPendingOrganizers()
    {
        var response = await _adminService.GetPendingOrganizersAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("organizers/{id}/approve")]
    public async Task<IActionResult> ApproveOrganizer(Guid id)
    {
        var response = await _adminService.ApproveOrganizerAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPost("organizers/{id}/reject")]
    public async Task<IActionResult> RejectOrganizer(Guid id)
    {
        var response = await _adminService.RejectOrganizerAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpGet("events/pending")]
    public async Task<IActionResult> GetPendingEvents()
    {
        var response = await _adminService.GetPendingEventsAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("events/{id}/approve")]
    public async Task<IActionResult> ApproveEvent(Guid id)
    {
        var response = await _adminService.ApproveEventAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPost("events/{id}/reject")]
    public async Task<IActionResult> RejectEvent(Guid id)
    {
        var response = await _adminService.RejectEventAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpPost("events/{id}/block")]
    public async Task<IActionResult> BlockEvent(Guid id)
    {
        var response = await _adminService.BlockEventAsync(id);
        return response.IsSuccess ? Ok(response) : NotFound(response);
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var response = await _adminService.GetOrdersAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments()
    {
        var response = await _adminService.GetPaymentsAsync();
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
}
