using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Services;

public class TicketTypeService : ITicketTypeService
{
    private readonly IUnitOfWork _unitOfWork;

    public TicketTypeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<TicketTypeDto>>> GetTicketTypesByEventIdAsync(Guid eventId)
    {
        var ev = await _unitOfWork.Events.GetEventWithDetailsAsync(eventId);
        if (ev == null)
            return ApiResponse<IReadOnlyList<TicketTypeDto>>.Failure("Event not found", 404);

        var dtos = ev.TicketTypes.Select(t => new TicketTypeDto
        {
            Id = t.Id,
            Name = t.Name,
            Description = t.Description,
            Price = t.Price,
            TotalQuantity = t.TotalQuantity,
            SoldQuantity = t.SoldQuantity,
            SaleStartTime = t.SaleStartTime,
            SaleEndTime = t.SaleEndTime
        }).ToList();

        return ApiResponse<IReadOnlyList<TicketTypeDto>>.Success(dtos);
    }

    public async Task<ApiResponse<TicketTypeDto>> CreateTicketTypeAsync(Guid eventId, CreateTicketTypeRequest request, Guid organizerUserId)
    {
        var ev = await _unitOfWork.Events.GetEventWithDetailsAsync(eventId);
        if (ev == null)
            return ApiResponse<TicketTypeDto>.Failure("Event not found", 404);

        if (ev.OrganizerId != organizerUserId)
            return ApiResponse<TicketTypeDto>.Failure("Unauthorized", 403);

        if (request.SaleEndTime > ev.StartTime)
            return ApiResponse<TicketTypeDto>.Failure("Sale end time cannot be after event start time", 400);

        var ticketType = new TicketType
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            TotalQuantity = request.TotalQuantity,
            SoldQuantity = 0,
            SaleStartTime = request.SaleStartTime,
            SaleEndTime = request.SaleEndTime
        };

        await _unitOfWork.TicketTypes.AddAsync(ticketType);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<TicketTypeDto>.Success(new TicketTypeDto
        {
            Id = ticketType.Id,
            Name = ticketType.Name,
            Description = ticketType.Description,
            Price = ticketType.Price,
            TotalQuantity = ticketType.TotalQuantity,
            SoldQuantity = ticketType.SoldQuantity,
            SaleStartTime = ticketType.SaleStartTime,
            SaleEndTime = ticketType.SaleEndTime
        });
    }

    public async Task<ApiResponse<TicketTypeDto>> UpdateTicketTypeAsync(Guid id, CreateTicketTypeRequest request, Guid organizerUserId)
    {
        var ticketType = await _unitOfWork.TicketTypes.GetByIdAsync(id);
        if (ticketType == null)
            return ApiResponse<TicketTypeDto>.Failure("Ticket type not found", 404);

        var ev = await _unitOfWork.Events.GetByIdAsync(ticketType.EventId);
        if (ev == null || ev.OrganizerId != organizerUserId)
            return ApiResponse<TicketTypeDto>.Failure("Unauthorized", 403);

        if (request.SaleEndTime > ev.StartTime)
            return ApiResponse<TicketTypeDto>.Failure("Sale end time cannot be after event start time", 400);

        if (request.TotalQuantity < ticketType.SoldQuantity)
            return ApiResponse<TicketTypeDto>.Failure("Total quantity cannot be less than sold quantity", 400);

        ticketType.Name = request.Name;
        ticketType.Description = request.Description;
        ticketType.Price = request.Price;
        ticketType.TotalQuantity = request.TotalQuantity;
        ticketType.SaleStartTime = request.SaleStartTime;
        ticketType.SaleEndTime = request.SaleEndTime;

        await _unitOfWork.TicketTypes.UpdateAsync(ticketType);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<TicketTypeDto>.Success(new TicketTypeDto
        {
            Id = ticketType.Id,
            Name = ticketType.Name,
            Description = ticketType.Description,
            Price = ticketType.Price,
            TotalQuantity = ticketType.TotalQuantity,
            SoldQuantity = ticketType.SoldQuantity,
            SaleStartTime = ticketType.SaleStartTime,
            SaleEndTime = ticketType.SaleEndTime
        });
    }

    public async Task<ApiResponse<string>> DeleteTicketTypeAsync(Guid id, Guid organizerUserId)
    {
        var ticketType = await _unitOfWork.TicketTypes.GetByIdAsync(id);
        if (ticketType == null)
            return ApiResponse<string>.Failure("Ticket type not found", 404);

        var ev = await _unitOfWork.Events.GetByIdAsync(ticketType.EventId);
        if (ev == null || ev.OrganizerId != organizerUserId)
            return ApiResponse<string>.Failure("Unauthorized", 403);

        if (ticketType.SoldQuantity > 0)
            return ApiResponse<string>.Failure("Cannot delete a ticket type that has already been sold", 400);

        await _unitOfWork.TicketTypes.DeleteAsync(ticketType);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Ticket type deleted successfully");
    }
}
