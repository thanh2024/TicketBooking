using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.DTOs.Payments;

public class CreatePaymentRequest
{
    public Guid OrderId { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.VNPAY;
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PaymentCallbackRequest
{
    public string TransactionId { get; set; } = string.Empty;
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public bool IsSuccess { get; set; }
    public string? Signature { get; set; }
}
