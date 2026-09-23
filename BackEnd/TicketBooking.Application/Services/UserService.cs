using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Users;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<UserProfileDto>> GetProfileAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdWithRolesAsync(userId);
        if (user == null)
            return ApiResponse<UserProfileDto>.Failure("User not found", 404);

        return ApiResponse<UserProfileDto>.Success(new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Roles = user.UserRoles?.Select(ur => ur.Role?.Name ?? string.Empty).ToList() ?? new List<string>(),
            CreatedAt = user.CreatedAt
        });
    }

    public async Task<ApiResponse<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserProfileDto>.Failure("User not found", 404);

        user.FullName = request.FullName;
        user.AvatarUrl = request.AvatarUrl;

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    public async Task<ApiResponse<string>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<string>.Failure("User not found", 404);

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return ApiResponse<string>.Failure("Current password is incorrect");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Password changed successfully");
    }
}
