namespace TicketBooking.Application.DTOs.Orders;

public class CreateOrderRequest
{
    public IList<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
}

public class OrderItemRequest
{
    public Guid TicketTypeId { get; set; }
    public int Quantity { get; set; }
}

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public IList<OrderDetailDto> OrderDetails { get; set; } = new List<OrderDetailDto>();
}

public class OrderDetailDto
{
    public Guid Id { get; set; }
    public string TicketTypeName { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
}
