using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Services;

public interface ICategoriesService
{
    // CREATE
    Task AddAsync(CategoryDTO categoryDto);
    // READ
    Task<IEnumerable<CategoryDTO>> GetAllAsync();
    Task<CategoryDTO> GetByIdAsync(int id);
    // UPDATE
    Task EditAsync(CategoryDTO categoryDto);
    // DELETE
    Task DeleteAsync(int id);
}