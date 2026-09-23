using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.HasIndex(x => x.Email).IsUnique();
        
        builder.Property(x => x.Email).IsRequired().HasMaxLength(256);
        builder.Property(x => x.PasswordHash).IsRequired().HasMaxLength(500);
        builder.Property(x => x.FullName).IsRequired().HasMaxLength(256);
        builder.Property(x => x.AvatarUrl).HasMaxLength(1000);

        builder.HasOne(x => x.Organizer)
               .WithOne(o => o.User)
               .HasForeignKey<Organizer>(o => o.UserId)
               .OnDelete(DeleteBehavior.Cascade);
               
        builder.HasMany(x => x.Orders)
               .WithOne(o => o.User)
               .HasForeignKey(o => o.UserId)
               .OnDelete(DeleteBehavior.Restrict);
               
        builder.HasMany(x => x.Reviews)
               .WithOne(r => r.User)
               .HasForeignKey(r => r.UserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
