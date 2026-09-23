using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class TicketTypeRepository : GenericRepository<TicketType>, ITicketTypeRepository
{
    public TicketTypeRepository(ApplicationDbContext dbContext) : base(dbContext) { }
}
