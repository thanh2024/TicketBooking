using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Tickets;

namespace TicketBooking.Application.Interfaces.Services;

public interface ITicketService
{
    Task<ApiResponse<IReadOnlyList<TicketDto>>> GetMyTicketsAsync(Guid userId);
    Task<ApiResponse<TicketDto>> GetTicketByIdAsync(Guid id, Guid userId);
    Task<ApiResponse<CheckInResultDto>> CheckInAsync(string ticketCode, Guid organizerUserId);
}
