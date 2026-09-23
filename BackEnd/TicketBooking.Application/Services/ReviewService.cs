using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.DTOs.Reviews;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReviewService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<ReviewDto>> CreateReviewAsync(CreateReviewRequest request, Guid userId)
    {
        var ev = await _unitOfWork.Events.GetByIdAsync(request.EventId);
        if (ev == null)
            return ApiResponse<ReviewDto>.Failure("Event not found", 404);

        var hasReviewed = await _unitOfWork.Reviews.HasUserReviewedEventAsync(userId, request.EventId);
        if (hasReviewed)
            return ApiResponse<ReviewDto>.Failure("You have already reviewed this event");

        if (request.Rating < 1 || request.Rating > 5)
            return ApiResponse<ReviewDto>.Failure("Rating must be between 1 and 5");

        var review = new Review
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            EventId = request.EventId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        await _unitOfWork.Reviews.AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        var user = await _unitOfWork.Users.GetByIdAsync(userId);

        return ApiResponse<ReviewDto>.Success(new ReviewDto
        {
            Id = review.Id,
            UserFullName = user?.FullName ?? string.Empty,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        });
    }

    public async Task<ApiResponse<IReadOnlyList<ReviewDto>>> GetReviewsByEventAsync(Guid eventId)
    {
        var reviews = await _unitOfWork.Reviews.GetReviewsByEventIdAsync(eventId);
        var dtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            UserFullName = r.User?.FullName ?? string.Empty,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<ReviewDto>>.Success(dtos);
    }

    public async Task<ApiResponse<ReviewDto>> UpdateReviewAsync(Guid id, Guid userId, int rating, string? comment)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(id);
        if (review == null)
            return ApiResponse<ReviewDto>.Failure("Review not found", 404);

        if (review.UserId != userId)
            return ApiResponse<ReviewDto>.Failure("Unauthorized", 403);

        if (rating < 1 || rating > 5)
            return ApiResponse<ReviewDto>.Failure("Rating must be between 1 and 5");

        review.Rating = rating;
        review.Comment = comment;

        await _unitOfWork.Reviews.UpdateAsync(review);
        await _unitOfWork.SaveChangesAsync();

        var user = await _unitOfWork.Users.GetByIdAsync(userId);

        return ApiResponse<ReviewDto>.Success(new ReviewDto
        {
            Id = review.Id,
            UserFullName = user?.FullName ?? string.Empty,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        });
    }

    public async Task<ApiResponse<string>> DeleteReviewAsync(Guid id, Guid userId)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(id);
        if (review == null)
            return ApiResponse<string>.Failure("Review not found", 404);

        if (review.UserId != userId)
        {
            // Allow admin to delete any review (checking roles would require getting user roles)
            var user = await _unitOfWork.Users.GetByIdWithRolesAsync(userId);
            if (user == null || !user.UserRoles.Any(ur => ur.Role.Name == TicketBooking.Domain.Enums.UserRole.ADMIN.ToString()))
            {
                return ApiResponse<string>.Failure("Unauthorized", 403);
            }
        }

        await _unitOfWork.Reviews.DeleteAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Review deleted successfully");
    }
}
