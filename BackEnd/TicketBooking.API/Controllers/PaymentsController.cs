using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Payments;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUserService;

    public PaymentsController(IPaymentService paymentService, ICurrentUserService currentUserService)
    {
        _paymentService = paymentService;
        _currentUserService = currentUserService;
    }

    /// <summary>
    /// Create a payment for a pending order. Only the order owner (CUSTOMER) can create a payment.
    /// </summary>
    [HttpPost("create")]
    [Authorize(Roles = "CUSTOMER")]
    public async Task<ActionResult<ApiResponse<PaymentDto>>> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _paymentService.CreatePaymentAsync(request, userId);

        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            if (response.Code == 409) return StatusCode(409, response);
            return BadRequest(response);
        }

        return Created($"/api/payments/{response.Data?.Id}", response);
    }

    /// <summary>
    /// Get payment details by ID.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<PaymentDto>>> GetPaymentById(Guid id)
    {
        var response = await _paymentService.GetPaymentByIdAsync(id);
        if (!response.IsSuccess)
            return NotFound(response);

        return Ok(response);
    }

    /// <summary>
    /// Payment gateway callback. This endpoint is called by the payment gateway (VNPay, MoMo, etc.)
    /// after the user completes payment. This endpoint is idempotent — calling it multiple times
    /// with the same data will NOT create duplicate tickets.
    /// </summary>
    [HttpPost("callback")]
    [AllowAnonymous] // Payment gateway calls this — no JWT
    public async Task<ActionResult<ApiResponse<string>>> PaymentCallback([FromBody] PaymentCallbackRequest request)
    {
        var response = await _paymentService.ProcessCallbackAsync(request);

        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            return BadRequest(response);
        }

        return Ok(response);
    }
}
