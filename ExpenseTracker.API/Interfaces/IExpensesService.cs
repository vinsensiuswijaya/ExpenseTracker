using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Interfaces;

public interface IExpensesService
{
    Task<Result<IEnumerable<ExpenseDto>>> GetByUserIdAsync(string userId);
    Task<Result<ExpenseDto>> GetByIdAsync(int id, string userId);
    Task<Result<ExpenseDto>> AddAsync(CreateExpenseDto createExpenseDto, string userId);
    Task<Result<bool>> EditAsync(int id, CreateExpenseDto updateExpenseDto, string userId);
    Task<Result<bool>> DeleteAsync(int id, string userId);
    Task<Result<IEnumerable<ExpenseChartDataDto>>> GetChartDataAsync(string userId);
}