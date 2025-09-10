using ExpenseTracker.API.Data;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context) { }
    public async Task<IEnumerable<Category>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }
}