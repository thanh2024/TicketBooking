using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Organizers;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.Services;

public class OrganizerService : IOrganizerService
{
    private readonly IUnitOfWork _unitOfWork;

    public OrganizerService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<OrganizerDto>> GetProfileAsync(Guid userId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (organizer == null)
            return ApiResponse<OrganizerDto>.Failure("Organizer profile not found", 404);

        return ApiResponse<OrganizerDto>.Success(new OrganizerDto
        {
            Id = organizer.Id,
            Name = organizer.Name,
            Description = organizer.Description,
            LogoUrl = organizer.LogoUrl,
            Phone = organizer.Phone,
            Email = organizer.Email,
            Status = organizer.Status.ToString()
        });
    }

    public async Task<ApiResponse<OrganizerDto>> RegisterOrganizerAsync(Guid userId, RegisterOrganizerRequest request)
    {
        var existingOrganizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (existingOrganizer != null)
            return ApiResponse<OrganizerDto>.Failure("User already has an organizer profile");

        var organizer = new Organizer
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            Phone = request.Phone,
            Email = request.Email,
            LogoUrl = request.LogoUrl,
            Status = OrganizerStatus.PENDING
        };

        await _unitOfWork.Organizers.AddAsync(organizer);
        
        // Cấp role ORGANIZER cho user? 
        // Thường thì sau khi Admin approve mới cấp, nhưng yêu cầu không đề cập chi tiết.
        // Để tạm thời không cấp role, hoặc tự động cấp tuỳ thiết kế.
        // Giả sử cần admin approve, chúng ta để PENDING và không add role.

        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<OrganizerDto>.Success(new OrganizerDto
        {
            Id = organizer.Id,
            Name = organizer.Name,
            Description = organizer.Description,
            LogoUrl = organizer.LogoUrl,
            Phone = organizer.Phone,
            Email = organizer.Email,
            Status = organizer.Status.ToString()
        });
    }

    public async Task<ApiResponse<OrganizerDto>> UpdateOrganizerAsync(Guid userId, UpdateOrganizerRequest request)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (organizer == null)
            return ApiResponse<OrganizerDto>.Failure("Organizer profile not found", 404);

        organizer.Name = request.Name;
        organizer.Description = request.Description;
        organizer.Phone = request.Phone;
        organizer.LogoUrl = request.LogoUrl;

        await _unitOfWork.Organizers.UpdateAsync(organizer);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<OrganizerDto>.Success(new OrganizerDto
        {
            Id = organizer.Id,
            Name = organizer.Name,
            Description = organizer.Description,
            LogoUrl = organizer.LogoUrl,
            Phone = organizer.Phone,
            Email = organizer.Email,
            Status = organizer.Status.ToString()
        });
    }

    public async Task<ApiResponse<OrganizerDashboardDto>> GetDashboardAsync(Guid userId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (organizer == null)
            return ApiResponse<OrganizerDashboardDto>.Failure("Organizer profile not found", 404);

        var events = await _unitOfWork.Events.GetAllAsync();
        var organizerEvents = events.Where(e => e.OrganizerId == organizer.Id).ToList();

        // Ticket stats
        var totalTickets = organizerEvents.SelectMany(e => e.TicketTypes).Sum(t => t.TotalQuantity);
        var soldTickets = organizerEvents.SelectMany(e => e.TicketTypes).Sum(t => t.SoldQuantity);

        // Order stats from PAID orders
        var allOrders = await _unitOfWork.Orders.GetOrdersByOrganizerIdAsync(organizer.Id);
        var paidOrders = allOrders.Where(o => o.Status == OrderStatus.PAID).ToList();

        var totalRevenue = paidOrders.Sum(o => o.TotalAmount);

        var now = DateTime.UtcNow;
        var monthlyRevenue = paidOrders
            .Where(o => o.CreatedAt.Year == now.Year && o.CreatedAt.Month == now.Month)
            .Sum(o => o.TotalAmount);

        // Recent 5 orders (all statuses, sorted newest first)
        var recentOrders = allOrders
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .SelectMany(o => o.OrderDetails.Take(1).Select(d => new RecentOrderSummaryDto
            {
                OrderId = o.Id,
                OrderCode = o.OrderCode,
                EventTitle = d.TicketType?.Event?.Title ?? string.Empty,
                TicketTypeName = d.TicketType?.Name ?? string.Empty,
                Quantity = o.OrderDetails.Sum(x => x.Quantity),
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            }))
            .ToList();

        var dashboard = new OrganizerDashboardDto
        {
            TotalEvents = organizerEvents.Count,
            ActiveEvents = organizerEvents.Count(e => e.Status == EventStatus.PUBLISHED),
            DraftEvents = organizerEvents.Count(e => e.Status == EventStatus.DRAFT),
            PendingEvents = organizerEvents.Count(e => e.Status == EventStatus.PENDING),
            TotalTickets = totalTickets,
            SoldTickets = soldTickets,
            AvailableTickets = totalTickets - soldTickets,
            TotalRevenue = totalRevenue,
            MonthlyRevenue = monthlyRevenue,
            TotalOrders = allOrders.Count,
            TotalAttendees = soldTickets,
            RecentOrders = recentOrders
        };

        return ApiResponse<OrganizerDashboardDto>.Success(dashboard);
    }

    public async Task<ApiResponse<IReadOnlyList<EventStatisticsDto>>> GetEventStatisticsAsync(Guid userId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (organizer == null)
            return ApiResponse<IReadOnlyList<EventStatisticsDto>>.Failure("Organizer profile not found", 404);

        var events = await _unitOfWork.Events.GetAllAsync();
        var organizerEvents = events.Where(e => e.OrganizerId == organizer.Id).ToList();

        var stats = organizerEvents.Select(e => new EventStatisticsDto
        {
            EventId = e.Id,
            EventTitle = e.Title,
            TotalTickets = e.TicketTypes.Sum(t => t.TotalQuantity),
            SoldTickets = e.TicketTypes.Sum(t => t.SoldQuantity),
            Revenue = 0, // Should be sum of completed orders
            Attendees = 0
        }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<EventStatisticsDto>>.Success(stats);
    }

    public async Task<ApiResponse<OrganizerRevenueDto>> GetRevenueAsync(Guid userId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(userId);
        if (organizer == null)
            return ApiResponse<OrganizerRevenueDto>.Failure("Organizer profile not found", 404);

        // Get all PAID orders for this organizer's events
        var allOrders = await _unitOfWork.Orders.GetOrdersByOrganizerIdAsync(organizer.Id);
        var paidOrders = allOrders
            .Where(o => o.Status == OrderStatus.PAID)
            .ToList();

        // Total summary
        var totalRevenue = paidOrders.Sum(o => o.TotalAmount);
        var totalTicketsSold = paidOrders.SelectMany(o => o.OrderDetails).Sum(d => d.Quantity);

        // Current month revenue
        var now = DateTime.UtcNow;
        var monthlyRevenue = paidOrders
            .Where(o => o.CreatedAt.Year == now.Year && o.CreatedAt.Month == now.Month)
            .Sum(o => o.TotalAmount);

        // Per-event revenue breakdown
        var events = await _unitOfWork.Events.GetAllAsync();
        var organizerEvents = events.Where(e => e.OrganizerId == organizer.Id).ToList();

        var eventRevenues = organizerEvents.Select(e =>
        {
            var eventOrders = paidOrders
                .Where(o => o.OrderDetails.Any(d => d.TicketType?.EventId == e.Id))
                .ToList();
            var revenue = eventOrders
                .Sum(o => o.OrderDetails
                    .Where(d => d.TicketType?.EventId == e.Id)
                    .Sum(d => d.SubTotal));
            var ticketsSold = eventOrders
                .SelectMany(o => o.OrderDetails.Where(d => d.TicketType?.EventId == e.Id))
                .Sum(d => d.Quantity);

            return new EventRevenueDto
            {
                EventId = e.Id,
                EventTitle = e.Title,
                ThumbnailUrl = e.ThumbnailUrl,
                StartTime = e.StartTime,
                Status = e.Status.ToString(),
                Revenue = revenue,
                TicketsSold = ticketsSold,
                TotalOrders = eventOrders.Count
            };
        })
        .OrderByDescending(e => e.Revenue)
        .ToList();

        // Monthly breakdown - last 6 months
        var monthlyBreakdown = Enumerable.Range(0, 6)
            .Select(i =>
            {
                var date = now.AddMonths(-i);
                var monthOrders = paidOrders
                    .Where(o => o.CreatedAt.Year == date.Year && o.CreatedAt.Month == date.Month)
                    .ToList();
                return new MonthlyRevenueDto
                {
                    Year = date.Year,
                    Month = date.Month,
                    MonthLabel = date.ToString("MM/yyyy"),
                    Revenue = monthOrders.Sum(o => o.TotalAmount),
                    OrderCount = monthOrders.Count
                };
            })
            .OrderBy(m => m.Year).ThenBy(m => m.Month)
            .ToList();

        var result = new OrganizerRevenueDto
        {
            TotalRevenue = totalRevenue,
            MonthlyRevenue = monthlyRevenue,
            TotalOrders = paidOrders.Count,
            TotalTicketsSold = totalTicketsSold,
            EventRevenues = eventRevenues,
            MonthlyBreakdown = monthlyBreakdown
        };

        return ApiResponse<OrganizerRevenueDto>.Success(result);
    }
}
