using Microsoft.EntityFrameworkCore;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Domain.Entities;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<Payment?> GetByOrderIdAsync(Guid orderId)
    {
        return await _dbContext.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.OrderId == orderId);
    }

    public async Task<Payment?> GetByTransactionIdAsync(string transactionId)
    {
        return await _dbContext.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.TransactionId == transactionId);
    }
}
