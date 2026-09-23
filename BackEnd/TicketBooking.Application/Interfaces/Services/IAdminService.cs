using TicketBooking.Application.DTOs.Admin;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.DTOs.Payments;

namespace TicketBooking.Application.Interfaces.Services;

public interface IAdminService
{
    Task<ApiResponse<AdminDashboardDto>> GetDashboardAsync();
    
    Task<ApiResponse<IReadOnlyList<AdminUserDto>>> GetUsersAsync();
    Task<ApiResponse<string>> LockUserAsync(Guid id);
    Task<ApiResponse<string>> UnlockUserAsync(Guid id);

    Task<ApiResponse<IReadOnlyList<AdminOrganizerDto>>> GetPendingOrganizersAsync();
    Task<ApiResponse<string>> ApproveOrganizerAsync(Guid id);
    Task<ApiResponse<string>> RejectOrganizerAsync(Guid id);

    Task<ApiResponse<IReadOnlyList<EventListDto>>> GetPendingEventsAsync();
    Task<ApiResponse<string>> ApproveEventAsync(Guid id);
    Task<ApiResponse<string>> RejectEventAsync(Guid id);
    Task<ApiResponse<string>> BlockEventAsync(Guid id);

    Task<ApiResponse<IReadOnlyList<OrderDto>>> GetOrdersAsync();
    Task<ApiResponse<IReadOnlyList<PaymentDto>>> GetPaymentsAsync();
}
