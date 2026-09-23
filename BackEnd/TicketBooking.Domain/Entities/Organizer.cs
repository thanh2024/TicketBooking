using TicketBooking.Domain.Common;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Domain.Entities;

public class Organizer : AuditableEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public OrganizerStatus Status { get; set; } = OrganizerStatus.PENDING;

    public ICollection<Event> Events { get; set; } = new List<Event>();
}
