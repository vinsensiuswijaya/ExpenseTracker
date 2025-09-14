using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Shared;

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

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var userId = User.GetUserId();
            var result = await _categoriesService.GetByUserIdAsync(userId);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Error });

            return Ok(result.Value);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var userId = User.GetUserId();
            var result = await _categoriesService.GetByIdAsync(id, userId);

            if (!result.IsSuccess)
                return NotFound(new {message = result.Error});

            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var userId = User.GetUserId();
            var result = await _categoriesService.AddAsync(createCategoryDto, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.Conflict => Conflict(new { message = result.Error }),
                    ErrorCode.ValidationFailed => BadRequest(new { message = result.Error }),
                    _ => BadRequest(result.Error)
                };
            }

            return CreatedAtAction(nameof(GetCategory), new { id = result.Value.Id }, result.Value);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CreateCategoryDto updateCategoryDto)
        {
            var userId = User.GetUserId();
            var result = await _categoriesService.EditAsync(id, updateCategoryDto, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(new { message = result.Error}),
                    ErrorCode.Conflict => Conflict(new { message = result.Error }),
                    ErrorCode.ValidationFailed => BadRequest(new { message = result.Error }),
                    _ => BadRequest(new { message = result.Error })
                };
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var userId = User.GetUserId();
            var result = await _categoriesService.DeleteAsync(id, userId);

            if (!result.IsSuccess)
            {
                return result.Code switch
                {
                    ErrorCode.NotFound => NotFound(new { message = result.Error }),
                    _ => BadRequest(new {message = result.Error })
                };
            }

            return NoContent();
        }
    }
}
