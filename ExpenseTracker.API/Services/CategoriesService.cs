using AutoMapper;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories;
using ExpenseTracker.API.Shared;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ExpenseTracker.API.Services;

public class CategoriesService : ICategoriesService
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private ICategoryRepository _categoryRepository;

    private const string DuplicateNameError = "Category name already exists.";

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
            return Result<CategoryDto>.NotFound("Category not found");

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return Result<CategoryDto>.Success(categoryDto);
    }

    public async Task<Result<CategoryDto>> AddAsync(CreateCategoryDto createCategoryDto, string userId)
    {
        var category = _mapper.Map<Category>(createCategoryDto);
        category.UserId = userId;

        await _categoryRepository.AddAsync(category);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pex && pex.SqlState == "23505")
        {
            return Result<CategoryDto>.Conflict(DuplicateNameError);
        }

        var categoryDto = _mapper.Map<CategoryDto>(category);
        return Result<CategoryDto>.Success(categoryDto);
    }

    public async Task<Result<bool>> EditAsync(int id, CreateCategoryDto updateCategoryDto, string userId)
    {
        var existingCategory = await _categoryRepository.GetByIdAsync(id);

        if (existingCategory == null || existingCategory.UserId != userId)
            return Result<bool>.NotFound("Category not found");

        _mapper.Map(updateCategoryDto, existingCategory);
        existingCategory.UserId = userId; // Ensure the UserId remains unchanged

        _categoryRepository.Update(existingCategory);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pex && pex.SqlState == "23505")
        {
            return Result<bool>.Conflict(DuplicateNameError);
        }
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(int id, string userId)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null || category.UserId != userId)
            return Result<bool>.NotFound("Category not found");

        _categoryRepository.Remove(category);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }
}