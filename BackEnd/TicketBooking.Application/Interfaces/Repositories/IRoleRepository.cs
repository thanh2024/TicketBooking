using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IRoleRepository : IGenericRepository<Role>
{
    Task<Role?> GetByNameAsync(string name);
}
