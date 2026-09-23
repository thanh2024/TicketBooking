using TicketBooking.Domain.Common;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Domain.Entities;

public class Order : AuditableEntity
{
    public string OrderCode { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.PENDING;

    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
