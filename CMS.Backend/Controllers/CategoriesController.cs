using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // API Controller sử dụng Route attribute để định nghĩa đường dẫn
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] // Bỏ comment dòng này nếu bạn muốn yêu cầu đăng nhập mới gọi được API
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Category
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Categories.ToList();
            return Ok(data); // Trả về danh sách dưới dạng JSON
        }

        // GET: api/Category/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST: api/Category
        [HttpPost]
        public IActionResult Create(Category model)
        {
            _context.Categories.Add(model);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        // PUT: api/Category/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, Category model)
        {
            if (id != model.Id) return BadRequest("ID không khớp");

            _context.Categories.Update(model);
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/Category/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            // Kiểm tra ràng buộc
            bool hasPosts = _context.Posts.Any(p => p.CategoryId == id);
            if (hasPosts)
            {
                return BadRequest("Không thể xóa danh mục vì đang chứa bài viết.");
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return NoContent();
        }
    }
}