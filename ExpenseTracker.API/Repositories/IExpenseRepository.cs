using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Repositories;

public interface IExpenseRepository : IGenericRepository<Expense>
{
    public Task<IEnumerable<ExpenseChartDataDTO>> GetChartDataAsync();
}