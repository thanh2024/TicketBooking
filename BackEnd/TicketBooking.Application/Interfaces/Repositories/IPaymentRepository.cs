using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Interfaces.Repositories;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<Payment?> GetByOrderIdAsync(Guid orderId);
    Task<Payment?> GetByTransactionIdAsync(string transactionId);
}
