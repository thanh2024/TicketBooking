using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Orders;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<OrderDto>> CreateOrderAsync(CreateOrderRequest request, Guid userId)
    {
        if (!request.Items.Any())
            return ApiResponse<OrderDto>.Failure("Order must have at least one item");

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderCode = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..4].ToUpper()}",
                UserId = userId,
                TotalAmount = 0,
                Status = OrderStatus.PENDING
            };

            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                var ticketType = await _unitOfWork.TicketTypes.GetByIdAsync(item.TicketTypeId);
                if (ticketType == null)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<OrderDto>.Failure($"Ticket type {item.TicketTypeId} not found");
                }

                if (ticketType.SoldQuantity + item.Quantity > ticketType.TotalQuantity)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<OrderDto>.Failure($"Not enough tickets available for '{ticketType.Name}'. Available: {ticketType.TotalQuantity - ticketType.SoldQuantity}");
                }

                var now = DateTime.UtcNow;
                var saleStart = ticketType.SaleStartTime.Kind == DateTimeKind.Utc
                    ? ticketType.SaleStartTime
                    : (ticketType.SaleStartTime.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(ticketType.SaleStartTime, DateTimeKind.Local).ToUniversalTime()
                        : ticketType.SaleStartTime.ToUniversalTime());

                var saleEnd = ticketType.SaleEndTime.Kind == DateTimeKind.Utc
                    ? ticketType.SaleEndTime
                    : (ticketType.SaleEndTime.Kind == DateTimeKind.Unspecified
                        ? DateTime.SpecifyKind(ticketType.SaleEndTime, DateTimeKind.Local).ToUniversalTime()
                        : ticketType.SaleEndTime.ToUniversalTime());

                if (now < saleStart || now > saleEnd)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ApiResponse<OrderDto>.Failure($"Ticket '{ticketType.Name}' is not on sale at this time");
                }

                var subTotal = ticketType.Price * item.Quantity;
                totalAmount += subTotal;

                order.OrderDetails.Add(new OrderDetail
                {
                    Id = Guid.NewGuid(),
                    TicketTypeId = item.TicketTypeId,
                    Quantity = item.Quantity,
                    UnitPrice = ticketType.Price,
                    SubTotal = subTotal
                });

                // Update sold quantity (Concurrency-safe via DB check constraint)
                ticketType.SoldQuantity += item.Quantity;
                await _unitOfWork.TicketTypes.UpdateAsync(ticketType);
            }

            order.TotalAmount = totalAmount;

            await _unitOfWork.Orders.AddAsync(order);

            await _unitOfWork.CommitTransactionAsync();

            return await GetOrderByIdAsync(order.Id, userId);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            
            if (ex.GetType().Name == "DbUpdateConcurrencyException")
            {
                return ApiResponse<OrderDto>.Failure("Due to high demand, the tickets you requested are no longer available. Please try again.", 409);
            }
            
            throw;
        }
    }

    public async Task<ApiResponse<IReadOnlyList<OrderDto>>> GetMyOrdersAsync(Guid userId)
    {
        var orders = await _unitOfWork.Orders.GetOrdersByUserIdAsync(userId);
        var dtos = orders.Select(MapToOrderDto).ToList().AsReadOnly();
        return ApiResponse<IReadOnlyList<OrderDto>>.Success(dtos);
    }

    public async Task<ApiResponse<OrderDto>> GetOrderByIdAsync(Guid id, Guid userId)
    {
        var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(id);
        if (order == null)
            return ApiResponse<OrderDto>.Failure("Order not found", 404);

        if (order.UserId != userId)
            return ApiResponse<OrderDto>.Failure("Unauthorized", 403);

        return ApiResponse<OrderDto>.Success(MapToOrderDto(order));
    }

    public async Task<ApiResponse<string>> CancelOrderAsync(Guid id, Guid userId)
    {
        var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(id);
        if (order == null)
            return ApiResponse<string>.Failure("Order not found", 404);

        if (order.UserId != userId)
            return ApiResponse<string>.Failure("Unauthorized", 403);

        if (order.Status != OrderStatus.PENDING)
            return ApiResponse<string>.Failure("Only pending orders can be cancelled");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            order.Status = OrderStatus.CANCELLED;
            await _unitOfWork.Orders.UpdateAsync(order);

            // Restore ticket quantity
            foreach (var detail in order.OrderDetails)
            {
                var ticketType = await _unitOfWork.TicketTypes.GetByIdAsync(detail.TicketTypeId);
                if (ticketType != null)
                {
                    ticketType.SoldQuantity -= detail.Quantity;
                    await _unitOfWork.TicketTypes.UpdateAsync(ticketType);
                }
            }

            await _unitOfWork.CommitTransactionAsync();
            return ApiResponse<string>.Success("Order cancelled successfully");
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<ApiResponse<IReadOnlyList<OrderDto>>> GetOrganizerOrdersAsync(Guid organizerUserId, Guid? eventId = null)
    {
        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null)
            return ApiResponse<IReadOnlyList<OrderDto>>.Failure("Organizer not found", 404);

        var orders = await _unitOfWork.Orders.GetOrdersByOrganizerIdAsync(organizer.Id, eventId);

        var dtos = orders.Select(MapToOrderDto).ToList().AsReadOnly();
        return ApiResponse<IReadOnlyList<OrderDto>>.Success(dtos);
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderCode = order.OrderCode,
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            OrderDetails = order.OrderDetails.Select(d => new OrderDetailDto
            {
                Id = d.Id,
                TicketTypeName = d.TicketType?.Name ?? string.Empty,
                EventTitle = d.TicketType?.Event?.Title ?? string.Empty,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice,
                SubTotal = d.SubTotal
            }).ToList()
        };
    }
}
