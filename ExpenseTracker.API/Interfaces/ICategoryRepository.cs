using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    public Task<IEnumerable<Category>> GetByUserIdAsync(string userId);
}