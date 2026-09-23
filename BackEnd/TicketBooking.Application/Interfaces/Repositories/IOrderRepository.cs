using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<IReadOnlyList<Order>> GetOrdersByUserIdAsync(Guid userId);
    Task<Order?> GetOrderWithDetailsAsync(Guid id);
    Task<IReadOnlyList<Order>> GetOrdersByOrganizerIdAsync(Guid organizerId, Guid? eventId = null);
}
