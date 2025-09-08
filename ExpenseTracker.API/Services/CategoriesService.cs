using AutoMapper;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
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

    public CategoriesService(IMapper mapper, ApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
        _categoryRepository = new CategoryRepository(context);
    }

    public async Task AddAsync(CategoryDto categoryDto)
    {
        var category = _mapper.Map<Category>(categoryDto);
        await _categoryRepository.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task EditAsync(CategoryDto updatedCategoryDto)
    {
        var category = _mapper.Map<Category>(updatedCategoryDto);
        _categoryRepository.Update(category);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category != null)
        {
            _categoryRepository.Remove(category);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category == null ? null : _mapper.Map<CategoryDto>(category);
    }
}