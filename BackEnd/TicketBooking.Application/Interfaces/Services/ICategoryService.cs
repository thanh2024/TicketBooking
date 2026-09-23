using TicketBooking.Application.DTOs.Categories;
using TicketBooking.Application.DTOs.Common;

namespace TicketBooking.Application.Interfaces.Services;

public interface ICategoryService
{
    Task<ApiResponse<IReadOnlyList<CategoryDto>>> GetAllCategoriesAsync();
    Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(Guid id);
    Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request);
    Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(Guid id, CreateCategoryRequest request);
    Task<ApiResponse<string>> DeleteCategoryAsync(Guid id);
}
