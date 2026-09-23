using TicketBooking.Domain.Common;

namespace TicketBooking.Domain.Entities;

public class EventImage : BaseEntity
{
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
