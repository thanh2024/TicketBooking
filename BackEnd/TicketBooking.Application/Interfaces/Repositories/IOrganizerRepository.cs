using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IOrganizerRepository : IGenericRepository<Organizer>
{
    Task<Organizer?> GetByUserIdAsync(Guid userId);
}
