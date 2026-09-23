using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.OrderCode).IsRequired().HasMaxLength(50);
        builder.HasIndex(x => x.OrderCode).IsUnique();
        
        builder.Property(x => x.TotalAmount).HasColumnType("decimal(18,2)");
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);

        builder.HasMany(x => x.OrderDetails)
               .WithOne(od => od.Order)
               .HasForeignKey(od => od.OrderId)
               .OnDelete(DeleteBehavior.Cascade);
               
        builder.HasMany(x => x.Payments)
               .WithOne(p => p.Order)
               .HasForeignKey(p => p.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Tickets)
               .WithOne(t => t.Order)
               .HasForeignKey(t => t.OrderId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
