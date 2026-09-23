using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Payments;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;
using TicketBooking.Domain.Enums;

namespace TicketBooking.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<PaymentDto>> CreatePaymentAsync(CreatePaymentRequest request, Guid userId)
    {
        // 1. Validate order exists and belongs to user
        var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(request.OrderId);
        if (order == null)
            return ApiResponse<PaymentDto>.Failure("Order not found", 404);

        if (order.UserId != userId)
            return ApiResponse<PaymentDto>.Failure("Unauthorized", 403);

        if (order.Status != OrderStatus.PENDING)
            return ApiResponse<PaymentDto>.Failure("Order is not in PENDING status. Cannot create payment.", 400);

        // 2. Idempotency: Check if a PENDING payment already exists for this order
        var existingPayment = await _unitOfWork.Payments.GetByOrderIdAsync(request.OrderId);
        if (existingPayment != null)
        {
            if (existingPayment.Status == PaymentStatus.PENDING)
            {
                // Return the existing pending payment instead of creating a new one
                return ApiResponse<PaymentDto>.Success(MapToDto(existingPayment), "Payment already exists for this order");
            }
            if (existingPayment.Status == PaymentStatus.SUCCESS)
            {
                return ApiResponse<PaymentDto>.Failure("This order has already been paid", 409);
            }
        }

        // 3. Create payment record
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = request.OrderId,
            Amount = order.TotalAmount,
            PaymentMethod = request.PaymentMethod,
            Status = PaymentStatus.PENDING,
            TransactionId = $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..6].ToUpper()}"
        };

        await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        // In a real system, you would now call the payment gateway (VNPay, MoMo, etc.)
        // and return the payment URL for the client to redirect to.
        var dto = MapToDto(payment);
        dto.OrderCode = order.OrderCode;

        return ApiResponse<PaymentDto>.Success(dto, "Payment created. Redirect to payment gateway.");
    }

    public async Task<ApiResponse<PaymentDto>> GetPaymentByIdAsync(Guid id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null)
            return ApiResponse<PaymentDto>.Failure("Payment not found", 404);

        return ApiResponse<PaymentDto>.Success(MapToDto(payment));
    }

    public async Task<ApiResponse<string>> ProcessCallbackAsync(PaymentCallbackRequest request)
    {
        // ====================================================================
        // IDEMPOTENCY: This is the most critical part of the payment flow.
        // Payment gateways may call this callback multiple times.
        // We MUST ensure that:
        //   1. We only process a payment ONCE
        //   2. We only generate tickets ONCE
        //   3. Duplicate callbacks are ignored gracefully
        // ====================================================================

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 1. Find the payment by OrderId
            var payment = await _unitOfWork.Payments.GetByOrderIdAsync(request.OrderId);
            if (payment == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<string>.Failure("Payment not found for this order", 404);
            }

            // 2. IDEMPOTENCY CHECK: If payment is already SUCCESS, do nothing
            if (payment.Status == PaymentStatus.SUCCESS)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<string>.Success("Payment already processed successfully. No action taken.");
            }

            // 3. If payment already FAILED or REFUNDED, reject late callbacks
            if (payment.Status != PaymentStatus.PENDING)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<string>.Failure($"Payment is in {payment.Status} status. Cannot process callback.", 400);
            }

            // 4. Validate amount matches (prevent tampering)
            if (payment.Amount != request.Amount)
            {
                payment.Status = PaymentStatus.FAILED;
                payment.TransactionId = request.TransactionId;
                await _unitOfWork.Payments.UpdateAsync(payment);
                await _unitOfWork.CommitTransactionAsync();
                return ApiResponse<string>.Failure("Payment amount mismatch. Payment marked as FAILED.", 400);
            }

            // 5. In production: Validate signature from payment gateway
            // if (!ValidateSignature(request)) { ... }

            if (!request.IsSuccess)
            {
                // Payment gateway reported failure
                payment.Status = PaymentStatus.FAILED;
                payment.TransactionId = request.TransactionId;
                await _unitOfWork.Payments.UpdateAsync(payment);
                await _unitOfWork.CommitTransactionAsync();
                return ApiResponse<string>.Failure("Payment failed at gateway", 400);
            }

            // 6. Payment SUCCESS → Update payment, order, and generate tickets
            payment.Status = PaymentStatus.SUCCESS;
            payment.TransactionId = request.TransactionId;
            await _unitOfWork.Payments.UpdateAsync(payment);

            // 7. Update order status to PAID
            var order = await _unitOfWork.Orders.GetOrderWithDetailsAsync(request.OrderId);
            if (order == null)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ApiResponse<string>.Failure("Order not found", 404);
            }

            order.Status = OrderStatus.PAID;
            await _unitOfWork.Orders.UpdateAsync(order);

            // 8. Generate tickets ONLY after payment success (NEVER before)
            foreach (var detail in order.OrderDetails)
            {
                for (int i = 0; i < detail.Quantity; i++)
                {
                    var ticket = new Ticket
                    {
                        Id = Guid.NewGuid(),
                        TicketCode = $"TKT-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                        OrderId = order.Id,
                        OrderDetailId = detail.Id,
                        TicketTypeId = detail.TicketTypeId,
                        QrCodeData = Guid.NewGuid().ToString(), // In production: generate proper QR code
                        Status = TicketStatus.VALID
                    };
                    await _unitOfWork.Tickets.AddAsync(ticket);
                }
            }

            await _unitOfWork.CommitTransactionAsync();

            return ApiResponse<string>.Success("Payment processed successfully. Tickets generated.");
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    private static PaymentDto MapToDto(Payment payment)
    {
        return new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            OrderCode = payment.Order?.OrderCode ?? string.Empty,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod.ToString(),
            Status = payment.Status.ToString(),
            TransactionId = payment.TransactionId,
            CreatedAt = payment.CreatedAt
        };
    }
}
