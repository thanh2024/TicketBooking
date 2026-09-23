using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IReviewRepository : IGenericRepository<Review>
{
    Task<IReadOnlyList<Review>> GetReviewsByEventIdAsync(Guid eventId);
    Task<bool> HasUserReviewedEventAsync(Guid userId, Guid eventId);
}
