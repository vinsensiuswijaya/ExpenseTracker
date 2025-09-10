using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface IExpenseRepository : IGenericRepository<Expense>
{
    public Task<IEnumerable<Expense>> GetByUserIdAsync(string userId);
    public Task<IEnumerable<ExpenseChartDataDto>> GetChartDataByUserAsync(string userId);
}