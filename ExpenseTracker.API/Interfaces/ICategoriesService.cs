using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Interfaces;

public interface ICategoriesService
{
    Task<Result<IEnumerable<CategoryDto>>> GetByUserIdAsync(string userId);
    Task<Result<CategoryDto>> GetByIdAsync(int id, string userId);
    Task<Result<CategoryDto>> AddAsync(CreateCategoryDto createCategoryDto, string userId);
    Task<Result<bool>> EditAsync(int id, CreateCategoryDto updateCategoryDto, string userId);
    Task<Result<bool>> DeleteAsync(int id, string userId);
}