using TicketBooking.Domain.Common;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Domain.Entities;

public class Ticket : AuditableEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid OrderDetailId { get; set; }
    public OrderDetail OrderDetail { get; set; } = null!;

    public Guid TicketTypeId { get; set; }
    public TicketType TicketType { get; set; } = null!;

    public string TicketCode { get; set; } = string.Empty;
    public string? QrCodeData { get; set; }
    
    public TicketStatus Status { get; set; } = TicketStatus.VALID;
    public DateTime? CheckedInAt { get; set; }
}
