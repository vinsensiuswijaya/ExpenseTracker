using ExpenseTracker.API.DTOs;

namespace ExpenseTracker.API.Interfaces;

public interface IExpensesService
{
    // CREATE
    Task AddAsync(ExpenseDto expenseDto);
    // READ
    Task<IEnumerable<ExpenseDto>> GetAllAsync();
    Task<ExpenseDto> GetByIdAsync(int id);
    // UPDATE
    Task EditAsync(ExpenseDto updatedExpenseDto);
    // DELETE
    Task DeleteAsync(int id);

    Task<IEnumerable<ExpenseChartDataDto>> GetChartDataAsync();
}