namespace TicketBooking.Application.DTOs.Organizers;

public class OrganizerDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class RegisterOrganizerRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class UpdateOrganizerRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class OrganizerDashboardDto
{
    public int TotalEvents { get; set; }
    public int ActiveEvents { get; set; }
    public int DraftEvents { get; set; }
    public int PendingEvents { get; set; }
    public int TotalTickets { get; set; }
    public int SoldTickets { get; set; }
    public int AvailableTickets { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalAttendees { get; set; }
    public IList<RecentOrderSummaryDto> RecentOrders { get; set; } = new List<RecentOrderSummaryDto>();
}

public class RecentOrderSummaryDto
{
    public Guid OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public string TicketTypeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class EventStatisticsDto
{
    public Guid EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public int TotalTickets { get; set; }
    public int SoldTickets { get; set; }
    public decimal Revenue { get; set; }
    public int Attendees { get; set; }
}

public class OrganizerRevenueDto
{
    public decimal TotalRevenue { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalTicketsSold { get; set; }
    public IList<EventRevenueDto> EventRevenues { get; set; } = new List<EventRevenueDto>();
    public IList<MonthlyRevenueDto> MonthlyBreakdown { get; set; } = new List<MonthlyRevenueDto>();
}

public class EventRevenueDto
{
    public Guid EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public DateTime StartTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int TicketsSold { get; set; }
    public int TotalOrders { get; set; }
}

public class MonthlyRevenueDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthLabel { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

