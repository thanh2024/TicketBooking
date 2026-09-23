using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.TicketCode).IsRequired().HasMaxLength(50);
        builder.HasIndex(x => x.TicketCode).IsUnique();
        
        builder.Property(x => x.QrCodeData).HasMaxLength(1000);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);

        builder.HasOne(x => x.Order)
               .WithMany(o => o.Tickets)
               .HasForeignKey(x => x.OrderId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.TicketType)
               .WithMany()
               .HasForeignKey(x => x.TicketTypeId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
