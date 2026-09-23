using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Reviews;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[ApiController]
[Route("api")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly ICurrentUserService _currentUserService;

    public ReviewsController(IReviewService reviewService, ICurrentUserService currentUserService)
    {
        _reviewService = reviewService;
        _currentUserService = currentUserService;
    }

    [HttpGet("events/{eventId}/reviews")]
    public async Task<IActionResult> GetReviewsByEvent(Guid eventId)
    {
        var response = await _reviewService.GetReviewsByEventAsync(eventId);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPost("events/{eventId}/reviews")]
    [Authorize(Roles = "CUSTOMER")]
    public async Task<IActionResult> CreateReview(Guid eventId, [FromBody] CreateReviewRequest request)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        request.EventId = eventId;
        var response = await _reviewService.CreateReviewAsync(request, userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpPut("reviews/{id}")]
    [Authorize(Roles = "CUSTOMER")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _reviewService.UpdateReviewAsync(id, userId.Value, request.Rating, request.Comment);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }

    [HttpDelete("reviews/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var userId = _currentUserService.UserId;
        if (!userId.HasValue) return Unauthorized();

        var response = await _reviewService.DeleteReviewAsync(id, userId.Value);
        return response.IsSuccess ? Ok(response) : BadRequest(response);
    }
}

public class UpdateReviewRequest
{
    public int Rating { get; set; }
    public string? Comment { get; set; }
}
