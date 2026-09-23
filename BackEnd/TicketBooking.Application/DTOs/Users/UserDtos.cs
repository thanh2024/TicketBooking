namespace TicketBooking.Application.DTOs.Users;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
}

public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
