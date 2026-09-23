using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
{
    public TicketRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<IReadOnlyList<Ticket>> GetTicketsByUserIdAsync(Guid userId)
    {
        return await _dbContext.Tickets
            .Include(t => t.TicketType)
                .ThenInclude(tt => tt.Event)
            .Where(t => t.Order.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Ticket?> GetTicketWithDetailsAsync(Guid id)
    {
        return await _dbContext.Tickets
            .Include(t => t.TicketType)
                .ThenInclude(tt => tt.Event)
            .Include(t => t.Order)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Ticket?> GetByTicketCodeAsync(string ticketCode)
    {
        return await _dbContext.Tickets
            .Include(t => t.TicketType)
                .ThenInclude(tt => tt.Event)
            .Include(t => t.Order)
            .FirstOrDefaultAsync(t => t.TicketCode == ticketCode);
    }
}
