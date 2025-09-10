using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Shared;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }
    public ErrorCode Code { get; }

    private Result(bool isSuccess, T value, string error, ErrorCode code)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        Code = code;
    }

    public static Result<T> Success(T value) => new(true, value, string.Empty, ErrorCode.None);
    public static Result<T> Failure(ErrorCode code, string error) => new(false, default, error, code);

    public static Result<T> NotFound(string error = "Not Found") => Failure(ErrorCode.NotFound, error);
    public static Result<T> Conflict(string error = "Conflict") => Failure(ErrorCode.Conflict, error);
    public static Result<T> Forbidden(string error = "Forbidden") => Failure(ErrorCode.Forbidden, error);
    public static Result<T> Validation(string error = "Validation failed") => Failure(ErrorCode.ValidationFailed, error);
}