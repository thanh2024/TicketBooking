using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IUserRepository : IGenericRepository<User> 
{ 
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
    Task<User?> GetByIdWithRolesAsync(Guid id);
    Task<IReadOnlyList<User>> GetAllWithRolesAsync();
}
