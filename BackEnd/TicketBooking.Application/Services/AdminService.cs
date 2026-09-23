using TicketBooking.Application.DTOs.Admin;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.DTOs.Payments;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<AdminDashboardDto>> GetDashboardAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        var organizers = await _unitOfWork.Organizers.GetAllAsync();
        var events = await _unitOfWork.Events.GetAllAsync();
        var orders = await _unitOfWork.Orders.GetAllAsync();
        var payments = await _unitOfWork.Payments.GetAllAsync();

        var dashboard = new AdminDashboardDto
        {
            TotalUsers = users.Count,
            TotalOrganizers = organizers.Count,
            PendingOrganizers = organizers.Count(o => o.Status == OrganizerStatus.PENDING),
            TotalEvents = events.Count,
            PendingEvents = events.Count(e => e.Status == EventStatus.PENDING),
            TotalOrders = orders.Count,
            TotalRevenue = payments.Where(p => p.Status == PaymentStatus.SUCCESS).Sum(p => p.Amount)
        };

        return ApiResponse<AdminDashboardDto>.Success(dashboard);
    }

    public async Task<ApiResponse<IReadOnlyList<AdminUserDto>>> GetUsersAsync()
    {
        var users = await _unitOfWork.Users.GetAllWithRolesAsync();
        var dtos = users.Select(u => new AdminUserDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            IsActive = u.IsActive,
            Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
            CreatedAt = u.CreatedAt
        }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<AdminUserDto>>.Success(dtos);
    }

    public async Task<ApiResponse<string>> LockUserAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return ApiResponse<string>.Failure("User not found", 404);

        user.IsActive = false;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("User locked successfully");
    }

    public async Task<ApiResponse<string>> UnlockUserAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null) return ApiResponse<string>.Failure("User not found", 404);

        user.IsActive = true;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("User unlocked successfully");
    }

    public async Task<ApiResponse<IReadOnlyList<AdminOrganizerDto>>> GetPendingOrganizersAsync()
    {
        var organizers = await _unitOfWork.Organizers.GetAllAsync();
        var pending = organizers.Where(o => o.Status == OrganizerStatus.PENDING)
            .Select(o => new AdminOrganizerDto
            {
                Id = o.Id,
                Name = o.Name,
                Email = o.Email,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<AdminOrganizerDto>>.Success(pending);
    }

    public async Task<ApiResponse<string>> ApproveOrganizerAsync(Guid id)
    {
        var organizer = await _unitOfWork.Organizers.GetByIdAsync(id);
        if (organizer == null) return ApiResponse<string>.Failure("Organizer not found", 404);

        organizer.Status = OrganizerStatus.APPROVED;
        
        // Cấp role ORGANIZER cho User
        var user = await _unitOfWork.Users.GetByIdWithRolesAsync(organizer.UserId);
        var organizerRole = await _unitOfWork.Roles.GetByNameAsync(UserRole.ORGANIZER.ToString());
        if (user != null && organizerRole != null && !user.UserRoles.Any(ur => ur.RoleId == organizerRole.Id))
        {
            user.UserRoles.Add(new TicketBooking.Domain.Entities.UserRole { RoleId = organizerRole.Id });
            await _unitOfWork.Users.UpdateAsync(user);
        }

        await _unitOfWork.Organizers.UpdateAsync(organizer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Organizer approved successfully");
    }

    public async Task<ApiResponse<string>> RejectOrganizerAsync(Guid id)
    {
        var organizer = await _unitOfWork.Organizers.GetByIdAsync(id);
        if (organizer == null) return ApiResponse<string>.Failure("Organizer not found", 404);

        organizer.Status = OrganizerStatus.REJECTED;
        await _unitOfWork.Organizers.UpdateAsync(organizer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Organizer rejected successfully");
    }

    public async Task<ApiResponse<IReadOnlyList<EventListDto>>> GetPendingEventsAsync()
    {
        var events = await _unitOfWork.Events.GetAllAsync();
        var pending = events.Where(e => e.Status == EventStatus.PENDING)
            .Select(e => new EventListDto
            {
                Id = e.Id,
                Title = e.Title,
                ThumbnailUrl = e.ThumbnailUrl,
                Location = e.Location,
                Status = e.Status.ToString(),
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                OrganizerName = e.Organizer?.User?.FullName ?? e.Organizer?.Name,
                Category = e.Category != null ? new TicketBooking.Application.DTOs.Categories.CategoryDto
                {
                    Id = e.Category.Id,
                    Name = e.Category.Name,
                    Description = e.Category.Description
                } : null,
                MinPrice = e.TicketTypes.Any() ? e.TicketTypes.Min(t => t.Price) : 0
            }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<EventListDto>>.Success(pending);
    }

    public async Task<ApiResponse<string>> ApproveEventAsync(Guid id)
    {
        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null) return ApiResponse<string>.Failure("Event not found", 404);

        ev.Status = EventStatus.PUBLISHED;
        await _unitOfWork.Events.UpdateAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Event approved successfully");
    }

    public async Task<ApiResponse<string>> RejectEventAsync(Guid id)
    {
        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null) return ApiResponse<string>.Failure("Event not found", 404);

        ev.Status = EventStatus.REJECTED;
        await _unitOfWork.Events.UpdateAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Event rejected successfully");
    }

    public async Task<ApiResponse<string>> BlockEventAsync(Guid id)
    {
        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null) return ApiResponse<string>.Failure("Event not found", 404);

        ev.Status = EventStatus.CANCELLED; // Hoặc thêm status BLOCKED tuỳ thiết kế
        await _unitOfWork.Events.UpdateAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Event blocked successfully");
    }

    public async Task<ApiResponse<IReadOnlyList<OrderDto>>> GetOrdersAsync()
    {
        var orders = await _unitOfWork.Orders.GetAllAsync();
        var dtos = orders
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                OrderCode = o.OrderCode,
                UserName = o.User?.FullName,
                UserEmail = o.User?.Email,
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                OrderDetails = o.OrderDetails.Select(d => new OrderDetailDto
                {
                    Id = d.Id,
                    TicketTypeName = d.TicketType?.Name ?? string.Empty,
                    EventTitle = d.TicketType?.Event?.Title ?? string.Empty,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                    SubTotal = d.SubTotal
                }).ToList()
            }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<OrderDto>>.Success(dtos);
    }

    public async Task<ApiResponse<IReadOnlyList<PaymentDto>>> GetPaymentsAsync()
    {
        var payments = await _unitOfWork.Payments.GetAllAsync();
        var dtos = payments
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                OrderId = p.OrderId,
                OrderCode = p.Order?.OrderCode ?? string.Empty,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod.ToString(),
                Status = p.Status.ToString(),
                TransactionId = p.TransactionId,
                CreatedAt = p.CreatedAt
            }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<PaymentDto>>.Success(dtos);
    }
}
