using TicketBooking.Application.DTOs.Categories;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.Services;

public class EventService : IEventService
{
    private readonly IUnitOfWork _unitOfWork;

    public EventService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<PaginatedResult<EventListDto>>> GetEventsAsync(EventFilterRequest filter)
    {
        var (items, totalCount) = await _unitOfWork.Events.GetFilteredEventsAsync(
            filter.Search, filter.CategoryId, filter.FromDate, filter.ToDate,
            filter.PageNumber, filter.PageSize);

        var dtos = items.Select(e => new EventListDto
        {
            Id = e.Id,
            Title = e.Title,
            ThumbnailUrl = e.ThumbnailUrl,
            Location = e.Location,
            StartTime = e.StartTime,
            EndTime = e.EndTime,
            Status = e.Status.ToString(),
            Category = e.Category != null ? new CategoryDto
            {
                Id = e.Category.Id,
                Name = e.Category.Name,
                Description = e.Category.Description
            } : null,
            MinPrice = e.TicketTypes.Any() ? e.TicketTypes.Min(t => t.Price) : 0
        }).ToList();

        var result = new PaginatedResult<EventListDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };

        return ApiResponse<PaginatedResult<EventListDto>>.Success(result);
    }

    public async Task<ApiResponse<EventDetailDto>> GetEventByIdAsync(Guid id)
    {
        var ev = await _unitOfWork.Events.GetEventWithDetailsAsync(id);
        if (ev == null)
            return ApiResponse<EventDetailDto>.Failure("Event not found", 404);

        var dto = new EventDetailDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            Location = ev.Location,
            StartTime = ev.StartTime,
            EndTime = ev.EndTime,
            ThumbnailUrl = ev.ThumbnailUrl,
            Status = ev.Status.ToString(),
            Category = ev.Category != null ? new CategoryDto
            {
                Id = ev.Category.Id,
                Name = ev.Category.Name,
                Description = ev.Category.Description
            } : null,
            OrganizerName = ev.Organizer?.User?.FullName,
            TicketTypes = ev.TicketTypes.Select(t => new TicketTypeDto
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Price = t.Price,
                TotalQuantity = t.TotalQuantity,
                SoldQuantity = t.SoldQuantity,
                SaleStartTime = t.SaleStartTime,
                SaleEndTime = t.SaleEndTime
            }).ToList(),
            ImageUrls = ev.EventImages.Select(i => i.ImageUrl).ToList(),
            CreatedAt = ev.CreatedAt
        };

        return ApiResponse<EventDetailDto>.Success(dto);
    }

    public async Task<ApiResponse<EventDetailDto>> CreateEventAsync(CreateEventRequest request, Guid organizerUserId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<EventDetailDto>.Failure("Organizer profile not found", 404);

        var ev = new Event
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            ThumbnailUrl = request.ThumbnailUrl,
            CategoryId = request.CategoryId,
            OrganizerId = organizer.Id,
            Status = EventStatus.DRAFT
        };

        foreach (var ttReq in request.TicketTypes)
        {
            ev.TicketTypes.Add(new TicketType
            {
                Id = Guid.NewGuid(),
                Name = ttReq.Name,
                Description = ttReq.Description,
                Price = ttReq.Price,
                TotalQuantity = ttReq.TotalQuantity,
                SoldQuantity = 0,
                SaleStartTime = ttReq.SaleStartTime,
                SaleEndTime = ttReq.SaleEndTime
            });
        }

        if (!string.IsNullOrWhiteSpace(request.ThumbnailUrl))
        {
            ev.EventImages.Add(new EventImage
            {
                Id = Guid.NewGuid(),
                ImageUrl = request.ThumbnailUrl,
                IsPrimary = true
            });
        }

        await _unitOfWork.Events.AddAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return await GetEventByIdAsync(ev.Id);
    }

    public async Task<ApiResponse<EventDetailDto>> UpdateEventAsync(Guid id, UpdateEventRequest request, Guid organizerUserId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<EventDetailDto>.Failure("Organizer profile not found", 404);

        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null)
            return ApiResponse<EventDetailDto>.Failure("Event not found", 404);

        if (ev.OrganizerId != organizer.Id)
            return ApiResponse<EventDetailDto>.Failure("Unauthorized", 403);

        ev.Title = request.Title;
        ev.Description = request.Description;
        ev.Location = request.Location;
        ev.StartTime = request.StartTime;
        ev.EndTime = request.EndTime;
        ev.ThumbnailUrl = request.ThumbnailUrl;
        ev.CategoryId = request.CategoryId;
        
        // Update EventImages if ThumbnailUrl changed
        if (!string.IsNullOrWhiteSpace(request.ThumbnailUrl))
        {
            var primaryImage = ev.EventImages.FirstOrDefault(i => i.IsPrimary) ?? ev.EventImages.FirstOrDefault();
            if (primaryImage != null)
            {
                primaryImage.ImageUrl = request.ThumbnailUrl;
            }
            else
            {
                ev.EventImages.Add(new EventImage
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = request.ThumbnailUrl,
                    IsPrimary = true
                });
            }
        }

        await _unitOfWork.Events.UpdateAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return await GetEventByIdAsync(ev.Id);
    }

    public async Task<ApiResponse<string>> DeleteEventAsync(Guid id, Guid organizerUserId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<string>.Failure("Organizer profile not found", 404);

        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null)
            return ApiResponse<string>.Failure("Event not found", 404);

        if (ev.OrganizerId != organizer.Id)
            return ApiResponse<string>.Failure("Unauthorized", 403);

        await _unitOfWork.Events.DeleteAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Event deleted successfully");
    }

    public async Task<ApiResponse<IReadOnlyList<EventListDto>>> GetFeaturedEventsAsync(int count = 5)
    {
        var events = await _unitOfWork.Events.GetFeaturedEventsAsync(count);
        var dtos = events.Select(MapToEventListDto).ToList();
        return ApiResponse<IReadOnlyList<EventListDto>>.Success(dtos);
    }

    public async Task<ApiResponse<IReadOnlyList<EventListDto>>> GetUpcomingEventsAsync(int count = 5)
    {
        var events = await _unitOfWork.Events.GetUpcomingEventsAsync(count);
        var dtos = events.Select(MapToEventListDto).ToList();
        return ApiResponse<IReadOnlyList<EventListDto>>.Success(dtos);
    }

    public async Task<ApiResponse<string>> SubmitEventAsync(Guid id, Guid organizerUserId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<string>.Failure("Organizer profile not found", 404);

        var ev = await _unitOfWork.Events.GetByIdAsync(id);
        if (ev == null)
            return ApiResponse<string>.Failure("Event not found", 404);

        if (ev.OrganizerId != organizer.Id)
            return ApiResponse<string>.Failure("Unauthorized", 403);

        if (ev.Status != EventStatus.DRAFT && ev.Status != EventStatus.REJECTED)
            return ApiResponse<string>.Failure("Event must be in DRAFT or REJECTED status to be submitted", 400);

        ev.Status = EventStatus.PENDING;
        await _unitOfWork.Events.UpdateAsync(ev);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Event submitted successfully");
    }

    public async Task<ApiResponse<IReadOnlyList<EventListDto>>> GetOrganizerEventsAsync(Guid organizerUserId)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<IReadOnlyList<EventListDto>>.Failure("Organizer profile not found", 404);

        var events = await _unitOfWork.Events.GetEventsByOrganizerIdAsync(organizer.Id);
        
        
        var dtos = events.Select(MapToEventListDto).ToList();
        return ApiResponse<IReadOnlyList<EventListDto>>.Success(dtos);
    }

    private EventListDto MapToEventListDto(Event e)
    {
        return new EventListDto
        {
            Id = e.Id,
            Title = e.Title,
            ThumbnailUrl = e.ThumbnailUrl,
            Location = e.Location,
            StartTime = e.StartTime,
            EndTime = e.EndTime,
            Status = e.Status.ToString(),
            Category = e.Category != null ? new CategoryDto
            {
                Id = e.Category.Id,
                Name = e.Category.Name,
                Description = e.Category.Description
            } : null,
            MinPrice = e.TicketTypes.Any() ? e.TicketTypes.Min(t => t.Price) : 0
        };
    }
}
