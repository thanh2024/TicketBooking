using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Tickets;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.Application.Services;

public class TicketService : ITicketService
{
    private readonly IUnitOfWork _unitOfWork;

    public TicketService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<TicketDto>>> GetMyTicketsAsync(Guid userId)
    {
        var tickets = await _unitOfWork.Tickets.GetTicketsByUserIdAsync(userId);
        var dtos = tickets.Select(t => new TicketDto
        {
            Id = t.Id,
            TicketCode = t.TicketCode,
            EventTitle = t.TicketType?.Event?.Title ?? string.Empty,
            TicketTypeName = t.TicketType?.Name ?? string.Empty,
            Status = t.Status.ToString(),
            QrCodeData = t.QrCodeData,
            CreatedAt = t.CreatedAt
        }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<TicketDto>>.Success(dtos);
    }

    public async Task<ApiResponse<TicketDto>> GetTicketByIdAsync(Guid id, Guid userId)
    {
        var ticket = await _unitOfWork.Tickets.GetTicketWithDetailsAsync(id);
        if (ticket == null)
            return ApiResponse<TicketDto>.Failure("Ticket not found", 404);

        if (ticket.Order?.UserId != userId)
            return ApiResponse<TicketDto>.Failure("Unauthorized", 403);

        return ApiResponse<TicketDto>.Success(new TicketDto
        {
            Id = ticket.Id,
            TicketCode = ticket.TicketCode,
            EventTitle = ticket.TicketType?.Event?.Title ?? string.Empty,
            TicketTypeName = ticket.TicketType?.Name ?? string.Empty,
            Status = ticket.Status.ToString(),
            QrCodeData = ticket.QrCodeData,
            CreatedAt = ticket.CreatedAt
        });
    }

    public async Task<ApiResponse<CheckInResultDto>> CheckInAsync(string ticketCode, Guid organizerUserId)
    {
        var scannedAt = DateTime.UtcNow;
        var ticket = await _unitOfWork.Tickets.GetByTicketCodeAsync(ticketCode);

        if (ticket == null)
            return ApiResponse<CheckInResultDto>.Failure("Không tìm thấy vé với mã này", 404);

        if (ticket.TicketType?.Event?.OrganizerId == null)
            return ApiResponse<CheckInResultDto>.Failure("Cấu hình vé không hợp lệ", 500);

        var organizer = await _unitOfWork.Organizers.GetByUserIdAsync(organizerUserId);
        if (organizer == null || ticket.TicketType.Event.OrganizerId != organizer.Id)
            return ApiResponse<CheckInResultDto>.Failure("Bạn không có quyền soát vé cho sự kiện này", 403);

        // Build holder info
        var holderName = ticket.Order?.User?.FullName ?? string.Empty;
        var holderEmail = ticket.Order?.User?.Email ?? string.Empty;

        if (ticket.Status == TicketBooking.Domain.Enums.TicketStatus.USED)
        {
            return ApiResponse<CheckInResultDto>.Failure("Vé đã được sử dụng trước đó", 400,
                new CheckInResultDto
                {
                    IsSuccess = false,
                    Message = "Vé đã được sử dụng",
                    TicketCode = ticket.TicketCode,
                    EventTitle = ticket.TicketType?.Event?.Title ?? string.Empty,
                    TicketTypeName = ticket.TicketType?.Name ?? string.Empty,
                    HolderName = holderName,
                    HolderEmail = holderEmail,
                    TicketStatus = ticket.Status.ToString(),
                    CheckedInAt = ticket.CheckedInAt,
                    ScannedAt = scannedAt
                });
        }

        if (ticket.Status != TicketBooking.Domain.Enums.TicketStatus.VALID)
        {
            return ApiResponse<CheckInResultDto>.Failure($"Vé không hợp lệ (trạng thái: {ticket.Status})", 400,
                new CheckInResultDto
                {
                    IsSuccess = false,
                    Message = $"Vé không hợp lệ",
                    TicketCode = ticket.TicketCode,
                    EventTitle = ticket.TicketType?.Event?.Title ?? string.Empty,
                    TicketTypeName = ticket.TicketType?.Name ?? string.Empty,
                    HolderName = holderName,
                    HolderEmail = holderEmail,
                    TicketStatus = ticket.Status.ToString(),
                    ScannedAt = scannedAt
                });
        }

        // SUCCESS: mark as USED
        ticket.Status = TicketBooking.Domain.Enums.TicketStatus.USED;
        ticket.CheckedInAt = scannedAt;

        await _unitOfWork.Tickets.UpdateAsync(ticket);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<CheckInResultDto>.Success(new CheckInResultDto
        {
            IsSuccess = true,
            Message = "Check-in thành công",
            TicketCode = ticket.TicketCode,
            EventTitle = ticket.TicketType?.Event?.Title ?? string.Empty,
            TicketTypeName = ticket.TicketType?.Name ?? string.Empty,
            HolderName = holderName,
            HolderEmail = holderEmail,
            TicketStatus = "USED",
            CheckedInAt = scannedAt,
            ScannedAt = scannedAt
        });
    }
}
