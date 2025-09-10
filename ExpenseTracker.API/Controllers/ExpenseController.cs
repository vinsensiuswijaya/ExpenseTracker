using System.Security.Claims;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.API.Enums;

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

        private string GetCurrentUserId()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                            User.FindFirst("sub")?.Value;

            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("User ID not found in token.");

            return userId;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.GetByUserIdAsync(userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            var ordered = result.Value.OrderBy(e => e.Id);
            return Ok(ordered);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.GetByIdAsync(id, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpense(CreateExpenseDto createExpenseDto)
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.AddAsync(createExpenseDto, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.ValidationFailed => BadRequest(result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            return CreatedAtAction(nameof(GetExpense), new { id = result.Value.Id }, result.Value);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, CreateExpenseDto updateExpenseDto)
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.EditAsync(id, updateExpenseDto, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(result.Error),
                    ErrorCode.ValidationFailed => BadRequest(result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.DeleteAsync(id, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(result.Error),
                    _ => BadRequest(result.Error)
                };
            }

            return NoContent();
        }

        [Authorize]
        [HttpGet("chart")]
        public async Task<ActionResult<IEnumerable<ExpenseChartDataDto>>> GetChartData()
        {
            var userId = GetCurrentUserId();
            var result = await _expensesService.GetChartDataAsync(userId);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }
    }
}
