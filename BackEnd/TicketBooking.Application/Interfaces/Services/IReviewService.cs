using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Reviews;

namespace TicketBooking.Application.Interfaces.Services;

public interface IReviewService
{
    Task<ApiResponse<ReviewDto>> CreateReviewAsync(CreateReviewRequest request, Guid userId);
    Task<ApiResponse<IReadOnlyList<ReviewDto>>> GetReviewsByEventAsync(Guid eventId);
    Task<ApiResponse<ReviewDto>> UpdateReviewAsync(Guid id, Guid userId, int rating, string? comment);
    Task<ApiResponse<string>> DeleteReviewAsync(Guid id, Guid userId);
}
