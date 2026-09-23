namespace TicketBooking.Application.DTOs.Admin;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int TotalOrganizers { get; set; }
    public int PendingOrganizers { get; set; }
    public int TotalEvents { get; set; }
    public int PendingEvents { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
}

public class AdminOrganizerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
