using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class EventRepository : GenericRepository<Event>, IEventRepository
{
    public EventRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<(IReadOnlyList<Event> Items, int TotalCount)> GetFilteredEventsAsync(
        string? search, Guid? categoryId, DateTime? fromDate, DateTime? toDate,
        int pageNumber, int pageSize)
    {
        var query = _dbContext.Events
            .Include(e => e.Category)
            .Include(e => e.TicketTypes)
            .Where(e => e.Status == EventStatus.PUBLISHED)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(e => e.Title.Contains(search) || (e.Location != null && e.Location.Contains(search)));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(e => e.StartTime >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(e => e.EndTime <= toDate.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(e => e.StartTime)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Event?> GetEventWithDetailsAsync(Guid id)
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .Include(e => e.TicketTypes)
            .Include(e => e.EventImages)
            .Include(e => e.Organizer)
                .ThenInclude(o => o!.User)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<IReadOnlyList<Event>> GetFeaturedEventsAsync(int count)
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .Include(e => e.TicketTypes)
            .Where(e => e.Status == EventStatus.PUBLISHED)
            .OrderByDescending(e => e.CreatedAt) // Assuming latest are featured, or some other criteria
            .Take(count)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Event>> GetUpcomingEventsAsync(int count)
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .Include(e => e.TicketTypes)
            .Where(e => e.Status == EventStatus.PUBLISHED && e.StartTime > DateTime.UtcNow)
            .OrderBy(e => e.StartTime)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Event>> GetEventsByOrganizerIdAsync(Guid organizerId)
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .Where(e => e.OrganizerId == organizerId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }
}
