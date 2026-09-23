using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class OrganizerRepository : GenericRepository<Organizer>, IOrganizerRepository
{
    public OrganizerRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<Organizer?> GetByUserIdAsync(Guid userId)
    {
        return await _dbContext.Organizers.FirstOrDefaultAsync(o => o.UserId == userId);
    }
}
