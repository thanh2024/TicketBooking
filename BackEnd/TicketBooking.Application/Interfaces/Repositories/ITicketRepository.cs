using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface ITicketRepository : IGenericRepository<Ticket>
{
    Task<IReadOnlyList<Ticket>> GetTicketsByUserIdAsync(Guid userId);
    Task<Ticket?> GetTicketWithDetailsAsync(Guid id);
    Task<Ticket?> GetByTicketCodeAsync(string ticketCode);
}
