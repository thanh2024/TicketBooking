using TicketBooking.Domain.Common;

namespace TicketBooking.Domain.Entities;

public class OrderDetail : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid TicketTypeId { get; set; }
    public TicketType TicketType { get; set; } = null!;

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }

    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
