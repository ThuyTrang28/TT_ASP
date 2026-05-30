using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Web.Controllers.Api
{
    // Đường dẫn API lúc này sẽ là: api/CategoryProducts
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/CategoryProducts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryProduct>>> GetCategoryProducts()
        {
            return await _context.CategoriesProducts.ToListAsync();
        }

        // 2. GET: api/CategoryProducts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryProduct>> GetCategoryProduct(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);

            if (categoryProduct == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id}" });
            }

            return categoryProduct;
        }

        // 3. POST: api/CategoryProducts
        [HttpPost]
        public async Task<ActionResult<CategoryProduct>> PostCategoryProduct(CategoryProduct categoryProduct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CategoriesProducts.Add(categoryProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoryProduct), new { id = categoryProduct.Id }, categoryProduct);
        }

        // 4. PUT: api/CategoryProducts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoryProduct(int id, CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id)
            {
                return BadRequest(new { message = "ID truyền vào không khớp với ID của danh mục" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(categoryProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryProductExists(id))
                {
                    return NotFound(new { message = $"Không thể cập nhật vì danh mục ID = {id} không tồn tại" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật danh mục sản phẩm thành công!", data = categoryProduct });
        }

        // 5. DELETE: api/CategoryProducts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryProduct(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);
            if (categoryProduct == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id} để xóa" });
            }

            bool hasProducts = await _context.Products.AnyAsync(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                return BadRequest(new { message = "Không thể xóa danh mục này vì đang có sản phẩm thuộc danh mục." });
            }

            _context.Remove(categoryProduct);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục sản phẩm thành công!" });
        }

        private bool CategoryProductExists(int id)
        {
            return _context.CategoriesProducts.Any(e => e.Id == id);
        }
    }
}