using Microsoft.EntityFrameworkCore.Storage;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Repositories;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _currentTransaction;

    public IUserRepository Users { get; }
    public IEventRepository Events { get; }
    public ICategoryRepository Categories { get; }
    public ITicketTypeRepository TicketTypes { get; }
    public IOrderRepository Orders { get; }
    public IPaymentRepository Payments { get; }
    public ITicketRepository Tickets { get; }
    public IReviewRepository Reviews { get; }
    public IRoleRepository Roles { get; }
    public IOrganizerRepository Organizers { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        IUserRepository users,
        IEventRepository events,
        ICategoryRepository categories,
        ITicketTypeRepository ticketTypes,
        IOrderRepository orders,
        IPaymentRepository payments,
        ITicketRepository tickets,
        IReviewRepository reviews,
        IRoleRepository roles,
        IOrganizerRepository organizers)
    {
        _context = context;
        Users = users;
        Events = events;
        Categories = categories;
        TicketTypes = ticketTypes;
        Orders = orders;
        Payments = payments;
        Tickets = tickets;
        Reviews = reviews;
        Roles = roles;
        Organizers = organizers;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null) return;
        _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync(cancellationToken);
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public void Dispose()
    {
        _context.Dispose();
        _currentTransaction?.Dispose();
    }
}
