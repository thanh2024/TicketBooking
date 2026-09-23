using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Organizers;

namespace TicketBooking.Application.Interfaces.Services;

public interface IOrganizerService
{
    Task<ApiResponse<OrganizerDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<OrganizerDto>> RegisterOrganizerAsync(Guid userId, RegisterOrganizerRequest request);
    Task<ApiResponse<OrganizerDto>> UpdateOrganizerAsync(Guid userId, UpdateOrganizerRequest request);
    Task<ApiResponse<OrganizerDashboardDto>> GetDashboardAsync(Guid userId);
    Task<ApiResponse<IReadOnlyList<EventStatisticsDto>>> GetEventStatisticsAsync(Guid userId);
    Task<ApiResponse<OrganizerRevenueDto>> GetRevenueAsync(Guid userId);
}
