using TicketBooking.Application.DTOs.Categories;

namespace TicketBooking.Application.DTOs.Events;

public class TicketTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public int SoldQuantity { get; set; }
    public int AvailableQuantity => TotalQuantity - SoldQuantity;
    public DateTime SaleStartTime { get; set; }
    public DateTime SaleEndTime { get; set; }
}

public class EventListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public CategoryDto? Category { get; set; }
    public decimal MinPrice { get; set; }
    public string? OrganizerName { get; set; }
}

public class EventDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public CategoryDto? Category { get; set; }
    public string? OrganizerName { get; set; }
    public IList<TicketTypeDto> TicketTypes { get; set; } = new List<TicketTypeDto>();
    public IList<string> ImageUrls { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
}

public class CreateEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? ThumbnailUrl { get; set; }
    public Guid CategoryId { get; set; }
    public IList<CreateTicketTypeRequest> TicketTypes { get; set; } = new List<CreateTicketTypeRequest>();
}

public class CreateTicketTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public DateTime SaleStartTime { get; set; }
    public DateTime SaleEndTime { get; set; }
}

public class UpdateEventRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string? ThumbnailUrl { get; set; }
    public Guid CategoryId { get; set; }
}

public class EventFilterRequest
{
    public string? Search { get; set; }
    public Guid? CategoryId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
