namespace TicketBooking.Application.DTOs.Tickets;

public class TicketDto
{
    public Guid Id { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public string TicketTypeName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? QrCodeData { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CheckInResultDto
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public string TicketCode { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public string TicketTypeName { get; set; } = string.Empty;
    public string HolderName { get; set; } = string.Empty;
    public string HolderEmail { get; set; } = string.Empty;
    public string TicketStatus { get; set; } = string.Empty;
    public DateTime? CheckedInAt { get; set; }
    public DateTime ScannedAt { get; set; }
}

public class CheckInRequest
{
    public string TicketCode { get; set; } = string.Empty;
}
