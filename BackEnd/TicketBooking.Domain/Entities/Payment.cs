using TicketBooking.Domain.Common;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Domain.Entities;

public class Payment : AuditableEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;
    public string? TransactionId { get; set; }
}
