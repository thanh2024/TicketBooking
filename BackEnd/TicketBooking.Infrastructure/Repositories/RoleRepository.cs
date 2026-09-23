using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    public RoleRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<Role?> GetByNameAsync(string name)
    {
        return await _dbContext.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }
}
