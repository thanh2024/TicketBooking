using TicketBooking.Domain.Entities;
using System.Linq.Expressions;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IEventRepository : IGenericRepository<Event>
{
    Task<(IReadOnlyList<Event> Items, int TotalCount)> GetFilteredEventsAsync(
        string? search, Guid? categoryId, DateTime? fromDate, DateTime? toDate,
        int pageNumber, int pageSize);
    Task<Event?> GetEventWithDetailsAsync(Guid id);
    Task<IReadOnlyList<Event>> GetFeaturedEventsAsync(int count);
    Task<IReadOnlyList<Event>> GetUpcomingEventsAsync(int count);
    Task<IReadOnlyList<Event>> GetEventsByOrganizerIdAsync(Guid organizerId);
}
