using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "CUSTOMER")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ICurrentUserService _currentUserService;

    public OrdersController(IOrderService orderService, ICurrentUserService currentUserService)
    {
        _orderService = orderService;
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderDto>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _orderService.CreateOrderAsync(request, userId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 409) return StatusCode(409, response); // Conflict / Overselling
            return BadRequest(response);
        }
            
        return CreatedAtAction(nameof(GetOrderById), new { id = response.Data?.Id }, response);
    }

    [HttpGet("my-orders")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<OrderDto>>>> GetMyOrders()
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _orderService.GetMyOrdersAsync(userId);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetOrderById(Guid id)
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _orderService.GetOrderByIdAsync(id, userId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<ApiResponse<string>>> CancelOrder(Guid id)
    {
        var userId = _currentUserService.UserId ?? Guid.Empty;
        var response = await _orderService.CancelOrderAsync(id, userId);
        
        if (!response.IsSuccess)
        {
            if (response.Code == 404) return NotFound(response);
            if (response.Code == 403) return StatusCode(403, response);
            return BadRequest(response);
        }
            
        return Ok(response);
    }
}
