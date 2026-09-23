using BCrypt.Net;
using TicketBooking.Application.DTOs.Auth;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(IUnitOfWork unitOfWork, IJwtTokenGenerator jwtTokenGenerator)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<ApiResponse<TokenResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return ApiResponse<TokenResponse>.Failure("Invalid email or password", 401);
        }

        if (!user.IsActive)
        {
            return ApiResponse<TokenResponse>.Failure("Account is locked", 403);
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        
        var accessToken = _jwtTokenGenerator.GenerateToken(user, roles);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<TokenResponse>.Success(new TokenResponse 
        { 
            AccessToken = accessToken, 
            RefreshToken = refreshToken 
        });
    }

    public async Task<ApiResponse<string>> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _unitOfWork.Users.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return ApiResponse<string>.Failure("Email already exists");
        }

        var customerRole = await _unitOfWork.Roles.GetByNameAsync(TicketBooking.Domain.Enums.UserRole.CUSTOMER.ToString());
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsActive = true
        };

        if (customerRole != null)
        {
            user.UserRoles.Add(new UserRole { RoleId = customerRole.Id });
        }

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("User registered successfully");
    }

    public async Task<ApiResponse<TokenResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var user = await _unitOfWork.Users.GetByRefreshTokenAsync(request.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return ApiResponse<TokenResponse>.Failure("Invalid refresh token", 401);
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var newAccessToken = _jwtTokenGenerator.GenerateToken(user, roles);
        var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<TokenResponse>.Success(new TokenResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    public async Task<ApiResponse<string>> LogoutAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return ApiResponse<string>.Failure("User not found");

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Logged out successfully");
    }
}
