using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Payments;

namespace TicketBooking.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> CreatePaymentAsync(CreatePaymentRequest request, Guid userId);
    Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid id);
    Task<ApiResponse<string>> ProcessCallbackAsync(PaymentCallbackRequest request);
}
