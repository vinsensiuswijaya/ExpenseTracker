using AutoMapper;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ExpenseTracker.API.Services;

public class CategoriesService : ICategoriesService
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private ICategoryRepository _categoryRepository;

    public CategoriesService(IMapper mapper, ApplicationDbContext context, ICategoryRepository categoryRepository)
    {
        _mapper = mapper;
        _context = context;
        _categoryRepository = categoryRepository;
    }

    public async Task<Result<IEnumerable<CategoryDto>>> GetByUserIdAsync(string userId)
    {
        var categories = await _categoryRepository.GetByUserIdAsync(userId);
        var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
        return Result<IEnumerable<CategoryDto>>.Success(categoryDtos);
    }

    public async Task<Result<CategoryDto>> GetByIdAsync(int id, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null || category.UserId != userId)
            return Result<CategoryDto>.Failure("Category not found");

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return Result<CategoryDto>.Success(categoryDto);
    }

    public async Task<Result<CategoryDto>> AddAsync(CreateCategoryDto createCategoryDto, string userId)
    {
        var category = _mapper.Map<Category>(createCategoryDto);
        category.UserId = userId;

        await _categoryRepository.AddAsync(category);
        await _context.SaveChangesAsync();

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return Result<CategoryDto>.Success(categoryDto);
    }

    public async Task<Result<bool>> EditAsync(int id, CreateCategoryDto updateCategoryDto, string userId)
    {
        var existingCategory = await _categoryRepository.GetByIdAsync(id);

        if (existingCategory == null || existingCategory.UserId != userId)
            return Result<bool>.Failure("Category not found");

        _mapper.Map(updateCategoryDto, existingCategory);
        existingCategory.UserId = userId; // Ensure the UserId remains unchanged
        _categoryRepository.Update(existingCategory);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(int id, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null || category.UserId != userId)
            return Result<bool>.Failure("Category not found");

        _categoryRepository.Remove(category);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }
}