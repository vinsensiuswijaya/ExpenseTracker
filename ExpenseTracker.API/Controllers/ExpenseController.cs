using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpensesService _expensesService;
        private readonly ICategoriesService _categoriesService;
        
        public ExpenseController(IExpensesService expensesService, ICategoriesService categoriesService)
        {
            _expensesService = expensesService;
            _categoriesService = categoriesService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
        {
            var expenses = await _expensesService.GetAllAsync();
            expenses.OrderBy(e => e.Id);

            return Ok(expenses);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
        {
            var expense = await _expensesService.GetByIdAsync(id);
            
            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpense(ExpenseDto expenseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _expensesService.AddAsync(expenseDto);
            
            return CreatedAtAction(nameof(GetExpense), new { id = expenseDto.Id}, expenseDto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, ExpenseDto expenseDto)
        {
            if (id != expenseDto.Id)
                return BadRequest();
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _expensesService.EditAsync(expenseDto);

            return Ok(expenseDto);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _expensesService.GetByIdAsync(id);

            if (expense == null)
                return NotFound();

            await _expensesService.DeleteAsync(id);

            return Ok();
        }

        [Authorize]
        [HttpGet("chart")]
        public async Task<ActionResult<IEnumerable<ExpenseChartDataDto>>> GetChartData()
        {
            var data = await _expensesService.GetChartDataAsync();
            return Ok(data);
        }
    }
}
