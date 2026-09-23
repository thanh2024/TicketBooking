using Microsoft.Extensions.DependencyInjection;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Application.Services;

namespace TicketBooking.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<ITicketService, TicketService>();
        services.AddScoped<ITicketTypeService, TicketTypeService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IOrganizerService, OrganizerService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IAdminService, AdminService>();

        return services;
    }
}
