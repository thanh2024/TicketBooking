using Microsoft.EntityFrameworkCore;
using TicketBooking.Infrastructure.Persistence;

namespace TicketBooking.API.Extensions;

public static class DatabaseExtensions
{
    public static async Task ApplyMigrationsAndSeedDataAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            var configuration = services.GetRequiredService<IConfiguration>();
            
            // Apply Migration
            await context.Database.MigrateAsync();
            
            var adminEmail = configuration["AdminSettings:Email"] ?? "admin@ticketbooking.com";
            var adminPassword = configuration["AdminSettings:Password"] ?? "Password123!";
            
            await ApplicationDbContextSeed.SeedDataAsync(context, adminEmail, adminPassword);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            throw;
        }
    }
}
