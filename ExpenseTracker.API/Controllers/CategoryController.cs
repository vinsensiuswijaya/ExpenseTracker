using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Services;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categories = await _categoriesService.GetAllAsync();
            return Ok(categories.OrderBy(c => c.Id) );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            var category = await _categoriesService.GetByIdAsync(id);

            if (category == null)
                return NotFound();
            
            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDTO>> CreateCategory(CategoryDTO categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _categoriesService.AddAsync(categoryDto);
            
            return CreatedAtAction(nameof(GetCategory), new { id = categoryDto.Id }, categoryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryDTO categoryDto)
        {
            if (id != categoryDto.Id)
                return BadRequest();
            
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            await _categoriesService.EditAsync(categoryDto);

            return Ok(categoryDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _categoriesService.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            await _categoriesService.DeleteAsync(id);

            return Ok();
        }
    }
}
