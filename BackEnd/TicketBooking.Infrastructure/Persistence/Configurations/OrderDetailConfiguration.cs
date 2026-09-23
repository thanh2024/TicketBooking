using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class OrderDetailConfiguration : IEntityTypeConfiguration<OrderDetail>
{
    public void Configure(EntityTypeBuilder<OrderDetail> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
        builder.Property(x => x.SubTotal).HasColumnType("decimal(18,2)");

        builder.ToTable(t => t.HasCheckConstraint("CK_OrderDetail_Quantity", "Quantity > 0"));

        builder.HasMany(x => x.Tickets)
               .WithOne(t => t.OrderDetail)
               .HasForeignKey(t => t.OrderDetailId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
