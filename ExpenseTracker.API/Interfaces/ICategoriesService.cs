using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface ICategoriesService
{
    // CREATE
    Task AddAsync(CategoryDto categoryDto);
    // READ
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> GetByIdAsync(int id);
    // UPDATE
    Task EditAsync(CategoryDto categoryDto);
    // DELETE
    Task DeleteAsync(int id);
}