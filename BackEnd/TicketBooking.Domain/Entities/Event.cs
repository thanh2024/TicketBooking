using TicketBooking.Domain.Common;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Domain.Entities;

public class Event : AuditableEntity
{
    public Guid OrganizerId { get; set; }
    public Organizer Organizer { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public EventStatus Status { get; set; } = EventStatus.DRAFT;

    public ICollection<EventImage> EventImages { get; set; } = new List<EventImage>();
    public ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
