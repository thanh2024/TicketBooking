using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;

namespace TicketBooking.Application.Interfaces.Services;

public interface ITicketTypeService
{
    Task<ApiResponse<IReadOnlyList<TicketTypeDto>>> GetTicketTypesByEventIdAsync(Guid eventId);
    Task<ApiResponse<TicketTypeDto>> CreateTicketTypeAsync(Guid eventId, CreateTicketTypeRequest request, Guid organizerUserId);
    Task<ApiResponse<TicketTypeDto>> UpdateTicketTypeAsync(Guid id, CreateTicketTypeRequest request, Guid organizerUserId);
    Task<ApiResponse<string>> DeleteTicketTypeAsync(Guid id, Guid organizerUserId);
}
