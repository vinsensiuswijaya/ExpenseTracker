using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Repositories;

public class ExpenseRepository : GenericRepository<Expense>, IExpenseRepository
{
    public ExpenseRepository(ApplicationDbContext context) : base(context) { }

    public override async Task<IEnumerable<Expense>> GetAllAsync()
    {
        return await _dbSet.Include(e => e.Category).ToListAsync();
    }

    public override async Task<Expense> GetByIdAsync(int id)
    {
        return await _dbSet.Include(e => e.Category) 
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<IEnumerable<ExpenseChartDataDto>> GetChartDataAsync()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .ToListAsync();

        var data = expenses
            .GroupBy(e => e.Category.Name)
            .Select(g => new ExpenseChartDataDto
            {
                Category = g.Key,
                Total = g.Sum(e => e.Amount)
            })
            .ToList();
        return data;
    }
}