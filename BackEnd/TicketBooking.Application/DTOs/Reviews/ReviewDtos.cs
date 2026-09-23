namespace TicketBooking.Application.DTOs.Reviews;

public class CreateReviewRequest
{
    public Guid EventId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}

public class ReviewDto
{
    public Guid Id { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
