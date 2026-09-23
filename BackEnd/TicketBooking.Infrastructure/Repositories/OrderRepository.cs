using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<IReadOnlyList<Order>> GetOrdersByUserIdAsync(Guid userId)
    {
        return await _dbContext.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.TicketType)
                    .ThenInclude(tt => tt.Event)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderWithDetailsAsync(Guid id)
    {
        return await _dbContext.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.TicketType)
                    .ThenInclude(tt => tt.Event)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IReadOnlyList<Order>> GetOrdersByOrganizerIdAsync(Guid organizerId, Guid? eventId = null)
    {
        var query = _dbContext.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.TicketType)
                    .ThenInclude(tt => tt.Event)
            .Include(o => o.User)
            .Where(o => o.OrderDetails.Any(d => d.TicketType.Event.OrganizerId == organizerId));

        if (eventId.HasValue)
            query = query.Where(o => o.OrderDetails.Any(d => d.TicketType.EventId == eventId.Value));

        return await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
}
