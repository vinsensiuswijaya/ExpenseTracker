using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Repositories;

public class ExpenseRepository : GenericRepository<Expense>, IExpenseRepository
{
    public ExpenseRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Expense>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(e => e.Category)
            .Where(e => e.UserId == userId)
            .ToListAsync();
    }

    public override async Task<Expense> GetByIdAsync(int id)
    {
        return await _dbSet
            .AsNoTracking()
            .Include(e => e.Category) 
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<IEnumerable<ExpenseChartDataDto>> GetChartDataByUserAsync(string userId)
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId)
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