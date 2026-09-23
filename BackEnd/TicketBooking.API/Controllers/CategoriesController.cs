using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketBooking.Application.DTOs.Categories;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Application.Interfaces.Services;

namespace TicketBooking.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryDto>>>> GetAllCategories()
    {
        var response = await _categoryService.GetAllCategoriesAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetCategoryById(Guid id)
    {
        var response = await _categoryService.GetCategoryByIdAsync(id);
        if (!response.IsSuccess)
            return NotFound(response);
            
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var response = await _categoryService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetCategoryById), new { id = response.Data?.Id }, response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> UpdateCategory(Guid id, [FromBody] CreateCategoryRequest request)
    {
        var response = await _categoryService.UpdateCategoryAsync(id, request);
        if (!response.IsSuccess)
            return NotFound(response);
            
        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteCategory(Guid id)
    {
        var response = await _categoryService.DeleteCategoryAsync(id);
        if (!response.IsSuccess)
            return NotFound(response);
            
        return Ok(response);
    }
}
