using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Title).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Location).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ThumbnailUrl).HasMaxLength(1000);
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(50);

        builder.ToTable(t => t.HasCheckConstraint("CK_Event_Time", "StartTime < EndTime"));

        builder.HasMany(x => x.EventImages)
               .WithOne(i => i.Event)
               .HasForeignKey(i => i.EventId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.TicketTypes)
               .WithOne(t => t.Event)
               .HasForeignKey(t => t.EventId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Reviews)
               .WithOne(r => r.Event)
               .HasForeignKey(r => r.EventId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
