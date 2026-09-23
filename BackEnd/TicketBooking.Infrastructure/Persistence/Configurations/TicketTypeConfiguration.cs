using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Infrastructure.Persistence.Configurations;

public class TicketTypeConfiguration : IEntityTypeConfiguration<TicketType>
{
    public void Configure(EntityTypeBuilder<TicketType> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name).IsRequired().HasMaxLength(256);
        builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
        builder.Property(x => x.RowVersion).IsRowVersion();
        
        builder.ToTable(t => 
        {
            t.HasCheckConstraint("CK_TicketType_Price", "Price >= 0");
            t.HasCheckConstraint("CK_TicketType_Quantity", "TotalQuantity > 0 AND SoldQuantity >= 0 AND SoldQuantity <= TotalQuantity");
            t.HasCheckConstraint("CK_TicketType_SaleTime", "SaleStartTime < SaleEndTime");
        });

        builder.HasMany(x => x.OrderDetails)
               .WithOne(od => od.TicketType)
               .HasForeignKey(od => od.TicketTypeId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
