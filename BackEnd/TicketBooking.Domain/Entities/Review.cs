using TicketBooking.Domain.Common;

namespace TicketBooking.Domain.Entities;

public class Review : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public int Rating { get; set; }
    public string? Comment { get; set; }
}
