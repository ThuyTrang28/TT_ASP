using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API lấy toàn bộ danh sách bài viết
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(posts);
        }

        // 2. API lấy danh sách bài viết theo Danh mục (Mới cập nhật)
        // Đường dẫn gọi API sẽ là: https://localhost:xxxx/api/posts/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ URL
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.CreatedDate) // Sắp xếp bài mới nhất lên đầu cho đồng bộ
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate // Đã sửa từ CreatedAt sang CreatedDate để không bị lỗi build
                })
                .ToList();

            return Ok(posts);
        }
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            // Dùng Include để nạp kèm thông tin bảng Category liên kết
            var post = _context.Posts
                .Include(p => p.Category)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content, // Đảm bảo lấy thêm nội dung bài viết để xem chi tiết
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có danh mục"
                })
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            return Ok(post);
        }

    }
}