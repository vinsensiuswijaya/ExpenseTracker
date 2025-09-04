using AutoMapper;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories;

namespace ExpenseTracker.API.Services;

public class ExpensesService : IExpensesService
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private IExpenseRepository _expenseRepository;

    public ExpensesService(IMapper mapper, ApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
        _expenseRepository = new ExpenseRepository(_context);
    }

    public async Task AddAsync(ExpenseDTO expenseDto)
    {
        var expense = _mapper.Map<Expense>(expenseDto);
        if (expense.Date.Kind == DateTimeKind.Unspecified)
            expense.Date = DateTime.SpecifyKind(expense.Date, DateTimeKind.Local).ToUniversalTime();
        else
            expense.Date = expense.Date.ToUniversalTime();

        await _expenseRepository.AddAsync(expense);
        await _context.SaveChangesAsync();
    }

    public async Task EditAsync(ExpenseDTO updatedExpenseDto)
    {
        var existingExpense = await _expenseRepository.GetByIdAsync(updatedExpenseDto.Id);
        
        _mapper.Map(updatedExpenseDto, existingExpense);

        if (existingExpense.Date.Kind == DateTimeKind.Unspecified)
            existingExpense.Date = DateTime.SpecifyKind(existingExpense.Date, DateTimeKind.Local).ToUniversalTime();
        else
            existingExpense.Date = existingExpense.Date.ToUniversalTime();
        
        _expenseRepository.Update(existingExpense);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense != null)
        {
            _expenseRepository.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
 
    public async Task<IEnumerable<ExpenseDTO>> GetAllAsync()
    {
        var expenses = await _expenseRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<ExpenseDTO>>(expenses);
    }

    public async Task<ExpenseDTO> GetByIdAsync(int id)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        return expense == null ? null : _mapper.Map<ExpenseDTO>(expense);
    }

    public async Task<IEnumerable<ExpenseChartDataDTO>> GetChartDataAsync()
    {
        var data = await _expenseRepository.GetChartDataAsync();
        return data;
    }
}