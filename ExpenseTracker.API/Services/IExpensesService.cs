using ExpenseTracker.API.DTOs;

namespace ExpenseTracker.API.Services;

public interface IExpensesService
{
    // CREATE
    Task AddAsync(ExpenseDTO expenseDto);
    // READ
    Task<IEnumerable<ExpenseDTO>> GetAllAsync();
    Task<ExpenseDTO> GetByIdAsync(int id);
    // UPDATE
    Task EditAsync(ExpenseDTO updatedExpenseDto);
    // DELETE
    Task DeleteAsync(int id);

    Task<IEnumerable<ExpenseChartDataDTO>> GetChartDataAsync();
}