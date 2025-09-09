using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories;

namespace ExpenseTracker.API.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    public Task<IEnumerable<Category>> GetByUserIdAsync(string userId);
}