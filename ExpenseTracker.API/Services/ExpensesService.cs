using AutoMapper;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories;

namespace ExpenseTracker.API.Services;

public class ExpensesService : IExpensesService
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private readonly IExpenseRepository _expenseRepository;

    public ExpensesService(IMapper mapper, ApplicationDbContext context, IExpenseRepository expenseRepository)
    {
        _mapper = mapper;
        _context = context;
        _expenseRepository = expenseRepository;
    }

    public async Task<Result<IEnumerable<ExpenseDto>>> GetByUserIdAsync(string userId)
    {
        var expenses = await _expenseRepository.GetByUserIdAsync(userId);
        var expenseDtos = _mapper.Map<IEnumerable<ExpenseDto>>(expenses);
        return Result<IEnumerable<ExpenseDto>>.Success(expenseDtos);
    }

    public async Task<Result<ExpenseDto>> GetByIdAsync(int id, string userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null || expense.UserId != userId)
            return Result<ExpenseDto>.Failure("Expense not found");

        var expenseDto = _mapper.Map<ExpenseDto>(expense);
        return Result<ExpenseDto>.Success(expenseDto);
    }

    public async Task<Result<ExpenseDto>> AddAsync(CreateExpenseDto createExpenseDto, string userId)
    {
        var expense = _mapper.Map<Expense>(createExpenseDto);
        expense.UserId = userId;

        if (expense.Date.Kind == DateTimeKind.Unspecified)
            expense.Date = DateTime.SpecifyKind(expense.Date, DateTimeKind.Local).ToUniversalTime();
        else
            expense.Date = expense.Date.ToUniversalTime();

        await _expenseRepository.AddAsync(expense);
        await _context.SaveChangesAsync();

        var savedExpense = await _expenseRepository.GetByIdAsync(expense.Id);
        var expenseDto = _mapper.Map<ExpenseDto>(savedExpense);
        return Result<ExpenseDto>.Success(expenseDto);
    }

    public async Task<Result<bool>> EditAsync(int id, CreateExpenseDto updateExpenseDto, string userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null || expense.UserId != userId)
            return Result<bool>.Failure("Expense not found");

        _mapper.Map(updateExpenseDto, expense);

        if (expense.Date.Kind == DateTimeKind.Unspecified)
            expense.Date = DateTime.SpecifyKind(expense.Date, DateTimeKind.Local).ToUniversalTime();
        else
            expense.Date = expense.Date.ToUniversalTime();

        _expenseRepository.Update(expense);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteAsync(int id, string userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);

        if (expense == null || expense.UserId != userId)
            return Result<bool>.Failure("Expense not found");

        _expenseRepository.Remove(expense);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<IEnumerable<ExpenseChartDataDto>>> GetChartDataAsync(string userId)
    {
        var chartData = await _expenseRepository.GetChartDataByUserAsync(userId);
        return Result<IEnumerable<ExpenseChartDataDto>>.Success(chartData);
    }
}