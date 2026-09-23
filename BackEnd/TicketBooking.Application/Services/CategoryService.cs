using TicketBooking.Application.DTOs.Categories;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.Interfaces;
using TicketBooking.Application.Interfaces.Services;
using TicketBooking.Domain.Entities;

namespace TicketBooking.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IReadOnlyList<CategoryDto>>> GetAllCategoriesAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        var dtos = categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        }).ToList().AsReadOnly();

        return ApiResponse<IReadOnlyList<CategoryDto>>.Success(dtos);
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.Failure("Category not found", 404);

        return ApiResponse<CategoryDto>.Success(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        });
    }

    public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Success(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        });
    }

    public async Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(Guid id, CreateCategoryRequest request)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.Failure("Category not found", 404);

        category.Name = request.Name;
        category.Description = request.Description;

        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Success(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        });
    }

    public async Task<ApiResponse<string>> DeleteCategoryAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return ApiResponse<string>.Failure("Category not found", 404);

        await _unitOfWork.Categories.DeleteAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Success("Category deleted successfully");
    }
}
