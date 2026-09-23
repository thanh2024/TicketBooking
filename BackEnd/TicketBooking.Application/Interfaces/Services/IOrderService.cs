using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Orders;

namespace TicketBooking.Application.Interfaces.Services;

public interface IOrderService
{
    Task<ApiResponse<OrderDto>> CreateOrderAsync(CreateOrderRequest request, Guid userId);
    Task<ApiResponse<IReadOnlyList<OrderDto>>> GetMyOrdersAsync(Guid userId);
    Task<ApiResponse<OrderDto>> GetOrderByIdAsync(Guid id, Guid userId);
    Task<ApiResponse<string>> CancelOrderAsync(Guid id, Guid userId);
    Task<ApiResponse<IReadOnlyList<OrderDto>>> GetOrganizerOrdersAsync(Guid organizerUserId, Guid? eventId = null);
}
