using System.Net;
using System.Text.Json;
using TicketBooking.Application.DTOs.Common;
using TicketBooking.Domain.Exceptions;

namespace TicketBooking.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        int statusCode;
        var message = exception.Message;

        switch (exception)
        {
            case NotFoundException:
                statusCode = (int)HttpStatusCode.NotFound;
                break;
            case BadRequestException:
                statusCode = (int)HttpStatusCode.BadRequest;
                break;
            case UnauthorizedException:
                statusCode = (int)HttpStatusCode.Unauthorized;
                break;
            case ForbiddenException:
                statusCode = (int)HttpStatusCode.Forbidden;
                break;
            case ConflictException:
                statusCode = (int)HttpStatusCode.Conflict;
                break;
            case ConcurrencyException:
                statusCode = (int)HttpStatusCode.Conflict;
                break;
            case DomainException:
                statusCode = (int)HttpStatusCode.BadRequest;
                break;
            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                message = "An internal server error occurred.";
                break;
        }

        context.Response.StatusCode = statusCode;
        
        var response = ApiResponse<object>.Failure(message, statusCode);
        var result = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        return context.Response.WriteAsync(result);
    }
}
