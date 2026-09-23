using TicketBooking.Domain.Common;

namespace TicketBooking.Domain.Entities;

public class TicketType : AuditableEntity
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public int SoldQuantity { get; set; }
    
    public DateTime SaleStartTime { get; set; }
    public DateTime SaleEndTime { get; set; }

    public byte[]? RowVersion { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
