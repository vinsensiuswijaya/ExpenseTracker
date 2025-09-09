using System.Security.Claims;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoriesService _categoriesService;

        public CategoryController(ICategoriesService categoriesService)
        {
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
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var userId = GetCurrentUserId();
            var result = await _categoriesService.GetByUserIdAsync(userId);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value.OrderBy(c => c.Id));
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _categoriesService.GetByIdAsync(id, userId);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var userId = GetCurrentUserId();
            var result = await _categoriesService.AddAsync(createCategoryDto, userId);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return CreatedAtAction(nameof(GetCategory), new { id = result.Value.Id }, result.Value);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CreateCategoryDto updateCategoryDto)
        {
            var userId = GetCurrentUserId();
            var result = await _categoriesService.EditAsync(id, updateCategoryDto, userId);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _categoriesService.DeleteAsync(id, userId);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return NoContent();
        }
    }
}
