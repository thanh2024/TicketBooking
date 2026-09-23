namespace TicketBooking.Application.DTOs.Common;

public class ApiResponse<T>
{
    public bool IsSuccess { get; set; }
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Success(T data, string message = "Success", int code = 200)
    {
        return new ApiResponse<T> { IsSuccess = true, Code = code, Message = message, Data = data };
    }

    public static ApiResponse<T> Failure(string message, int code = 400)
    {
        return new ApiResponse<T> { IsSuccess = false, Code = code, Message = message, Data = default };
    }

    public static ApiResponse<T> Failure(string message, int code, T data)
    {
        return new ApiResponse<T> { IsSuccess = false, Code = code, Message = message, Data = data };
    }
}
