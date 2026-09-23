using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TicketBooking.Application.DTOs.Common;

namespace TicketBooking.API.Filters;

public class ValidationFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ModelState.IsValid)
        {
            var errorsInModelState = context.ModelState
                .Where(x => x.Value != null && x.Value.Errors.Count > 0)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value!.Errors.Select(x => x.ErrorMessage)).ToArray();

            var errorResponse = new ApiResponse<object>
            {
                IsSuccess = false,
                Code = 400,
                Message = "Validation failed",
                Data = errorsInModelState
            };

            context.Result = new BadRequestObjectResult(errorResponse);
            return;
        }

        await next();
    }
}
