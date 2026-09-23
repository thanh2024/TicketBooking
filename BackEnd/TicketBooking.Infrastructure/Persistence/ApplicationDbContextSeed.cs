using Microsoft.EntityFrameworkCore;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;
using BCrypt.Net;

namespace TicketBooking.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedDataAsync(ApplicationDbContext context, string adminEmail, string adminPassword)
    {
        if (!await context.Roles.AnyAsync())
        {
            context.Roles.AddRange(
                new Role { Name = TicketBooking.Domain.Enums.UserRole.ADMIN.ToString() },
                new Role { Name = TicketBooking.Domain.Enums.UserRole.ORGANIZER.ToString() },
                new Role { Name = TicketBooking.Domain.Enums.UserRole.CUSTOMER.ToString() }
            );
            await context.SaveChangesAsync();
        }

        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category { Name = "Âm nhạc", Description = "Sự kiện âm nhạc, ca nhạc" },
                new Category { Name = "Thể thao", Description = "Sự kiện thể thao" },
                new Category { Name = "Hội thảo", Description = "Hội thảo chuyên môn" },
                new Category { Name = "Workshop", Description = "Workshop thực hành" },
                new Category { Name = "Kịch", Description = "Sân khấu kịch" },
                new Category { Name = "Giải trí", Description = "Các sự kiện giải trí khác" }
            );
            await context.SaveChangesAsync();
        }

        if (!await context.Users.AnyAsync(u => u.Email == adminEmail))
        {
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == TicketBooking.Domain.Enums.UserRole.ADMIN.ToString());
            
            if (adminRole != null)
            {
                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Email = adminEmail,
                    FullName = "System Admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    IsActive = true
                };

                adminUser.UserRoles.Add(new TicketBooking.Domain.Entities.UserRole { RoleId = adminRole.Id });
                context.Users.Add(adminUser);
                
                await context.SaveChangesAsync();
            }
        }
    }
}
