using AutoMapper;
using TicketBooking.Application.DTOs.Categories;
using TicketBooking.Application.DTOs.Events;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.DTOs.Organizers;
using TicketBooking.Application.DTOs.Payments;
using TicketBooking.Application.DTOs.Reviews;
using TicketBooking.Application.DTOs.Tickets;
using TicketBooking.Application.DTOs.Users;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Category
        CreateMap<Category, CategoryDto>();

        // Event
        CreateMap<Event, EventListDto>()
            .ForMember(d => d.MinPrice, opt => opt.MapFrom(s => s.TicketTypes.Any() ? s.TicketTypes.Min(t => t.Price) : 0));
        CreateMap<Event, EventDetailDto>()
            .ForMember(d => d.OrganizerName, opt => opt.MapFrom(s => s.Organizer != null ? s.Organizer.Name : null))
            .ForMember(d => d.ImageUrls, opt => opt.MapFrom(s => s.EventImages.Select(i => i.ImageUrl)));
        
        // TicketType
        CreateMap<TicketType, TicketTypeDto>();
        
        // Order
        CreateMap<Order, OrderDto>();
        CreateMap<OrderDetail, OrderDetailDto>()
            .ForMember(d => d.TicketTypeName, opt => opt.MapFrom(s => s.TicketType != null ? s.TicketType.Name : null))
            .ForMember(d => d.EventTitle, opt => opt.MapFrom(s => (s.TicketType != null && s.TicketType.Event != null) ? s.TicketType.Event.Title : null));

        // Payment
        CreateMap<Payment, PaymentDto>();

        // Ticket
        CreateMap<Ticket, TicketDto>()
            .ForMember(d => d.EventTitle, opt => opt.MapFrom(s => (s.TicketType != null && s.TicketType.Event != null) ? s.TicketType.Event.Title : null))
            .ForMember(d => d.TicketTypeName, opt => opt.MapFrom(s => s.TicketType != null ? s.TicketType.Name : null));

        // User
        CreateMap<User, UserProfileDto>()
            .ForMember(d => d.Roles, opt => opt.MapFrom(s => s.UserRoles.Select(ur => ur.Role != null ? ur.Role.Name : string.Empty)));

        // Organizer
        CreateMap<Organizer, OrganizerDto>();

        // Review
        CreateMap<Review, ReviewDto>()
            .ForMember(d => d.UserFullName, opt => opt.MapFrom(s => s.User != null ? s.User.FullName : null));
    }
}
