using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Services;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDTO>>> GetExpenses()
        {
            var expenses = await _expensesService.GetAllAsync();
            expenses.OrderBy(e => e.Id);

            return Ok(expenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDTO>> GetExpense(int id)
        {
            var expense = await _expensesService.GetByIdAsync(id);
            
            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDTO>> CreateExpense(ExpenseDTO expenseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _expensesService.AddAsync(expenseDto);
            
            return CreatedAtAction(nameof(GetExpense), new { id = expenseDto.Id}, expenseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, ExpenseDTO expenseDto)
        {
            if (id != expenseDto.Id)
                return BadRequest();
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _expensesService.EditAsync(expenseDto);

            return Ok(expenseDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _expensesService.GetByIdAsync(id);

            if (expense == null)
                return NotFound();

            await _expensesService.DeleteAsync(id);

            return Ok();
        }

        [HttpGet("chart")]
        public async Task<ActionResult<IEnumerable<ExpenseChartDataDTO>>> GetChartData()
        {
            var data = await _expensesService.GetChartDataAsync();
            return Ok(data);
        }
    }
}
