using TicketBooking.Application.Interfaces.Repositories;

namespace TicketBooking.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IEventRepository Events { get; }
    ICategoryRepository Categories { get; }
    ITicketTypeRepository TicketTypes { get; }
    IOrderRepository Orders { get; }
    IPaymentRepository Payments { get; }
    ITicketRepository Tickets { get; }
    IReviewRepository Reviews { get; }
    IRoleRepository Roles { get; }
    IOrganizerRepository Organizers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
