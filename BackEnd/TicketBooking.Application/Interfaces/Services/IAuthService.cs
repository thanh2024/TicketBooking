using TicketBooking.Application.DTOs.Auth;
using TicketBooking.Application.DTOs.Common;

namespace TicketBooking.Application.Interfaces.Services;

public interface IAuthService
{
    Task<ApiResponse<TokenResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<string>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<TokenResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<string>> LogoutAsync(Guid userId);
}
