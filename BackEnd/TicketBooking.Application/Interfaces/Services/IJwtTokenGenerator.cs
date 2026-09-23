using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Services;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user, IList<string> roles);
    string GenerateRefreshToken();
}
