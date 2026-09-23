using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<IReadOnlyList<Review>> GetReviewsByEventIdAsync(Guid eventId)
    {
        return await _dbContext.Reviews
            .Include(r => r.User)
            .Where(r => r.EventId == eventId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> HasUserReviewedEventAsync(Guid userId, Guid eventId)
    {
        return await _dbContext.Reviews
            .AnyAsync(r => r.UserId == userId && r.EventId == eventId);
    }
}
