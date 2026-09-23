using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Users;

namespace TicketBooking.Application.Interfaces.Services;

public interface IUserService
{
    Task<ApiResponse<UserProfileDto>> GetProfileAsync(Guid userId);
    Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task<ApiResponse<string>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}
