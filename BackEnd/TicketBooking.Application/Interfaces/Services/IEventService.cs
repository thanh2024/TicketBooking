using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;

namespace TicketBooking.Application.Interfaces.Services;

public interface IEventService
{
    Task<ApiResponse<PaginatedResult<EventListDto>>> GetEventsAsync(EventFilterRequest filter);
    Task<ApiResponse<EventDetailDto>> GetEventByIdAsync(Guid id);
    Task<ApiResponse<EventDetailDto>> CreateEventAsync(CreateEventRequest request, Guid organizerUserId);
    Task<ApiResponse<EventDetailDto>> UpdateEventAsync(Guid id, UpdateEventRequest request, Guid organizerUserId);
    Task<ApiResponse<string>> DeleteEventAsync(Guid id, Guid organizerUserId);
    Task<ApiResponse<IReadOnlyList<EventListDto>>> GetFeaturedEventsAsync(int count = 5);
    Task<ApiResponse<IReadOnlyList<EventListDto>>> GetUpcomingEventsAsync(int count = 5);
    Task<ApiResponse<string>> SubmitEventAsync(Guid id, Guid organizerUserId);
    Task<ApiResponse<IReadOnlyList<EventListDto>>> GetOrganizerEventsAsync(Guid organizerUserId);
}
