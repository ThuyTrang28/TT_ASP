/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: API Controller cung cấp dữ liệu và xử lý CRUD Bài viết/Tin tức (JSON) cho Frontend
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // =========================================================================
        // 1. NHÓM API ĐỌC DỮ LIỆU (GET) - PHỤC VỤ HIỂN THỊ FRONTEND
        // =========================================================================

        // 1. API lấy toàn bộ danh sách bài viết
        // GET: api/Posts
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
                    p.CategoryId,
                    CategoryName = p.Category != null ? p.Category.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(posts);
        }

        // 1.1 API: Lấy danh sách bài viết mới nhất (ví dụ: lấy 3 bài viết mới nhất)
        // GET: api/Posts/latest/{count}
        [HttpGet("latest/{count}")]
        public IActionResult GetLatestPosts(int count)
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.CreatedDate) // Sắp xếp theo ngày tạo mới nhất
                .Take(count)                          // Lấy số lượng theo yêu cầu
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        // 2. API lấy danh sách bài viết theo Danh mục
        // GET: api/Posts/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    // Thêm trường CategoryName để đồng bộ giao diện
                    CategoryName = p.Category != null ? p.Category.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(posts);
        }

        // 3. API lấy chi tiết một bài viết theo ID
        // GET: api/Posts/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.Content,
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

        // =========================================================================
        // 2. NHÓM API THAY ĐỔI DỮ LIỆU (POST, PUT, DELETE) - PHỤC VỤ QUẢN TRỊ ADMIN
        // =========================================================================

        // 4. API: Thêm mới một bài viết bài viết
        // POST: api/Posts
        [HttpPost]
        public IActionResult Create([FromBody] Post post)
        {
            if (post == null)
            {
                return BadRequest(new { message = "Dữ liệu bài viết gửi lên không hợp lệ" });
            }

            try
            {
                // Nếu ở FE không gửi ngày lên, hệ thống tự động gán ngày giờ hiện tại
                if (post.CreatedDate == default)
                {
                    post.CreatedDate = DateTime.Now;
                }

                _context.Posts.Add(post);
                _context.SaveChanges();

                return CreatedAtAction(nameof(GetDetail), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu bài viết", error = ex.Message });
            }
        }

        // 5. API: Cập nhật thông tin bài viết theo ID
        // PUT: api/Posts/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Post updatedPost)
        {
            if (updatedPost == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ" });
            }

            // Tìm bài viết gốc hiện có trong SQL Server
            var existingPost = _context.Posts.FirstOrDefault(p => p.Id == id);
            if (existingPost == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết cần cập nhật" });
            }

            try
            {
                // Đồng bộ dữ liệu mới từ Frontend gửi lên
                existingPost.Title = updatedPost.Title;
                existingPost.Content = updatedPost.Content;
                existingPost.ImageUrl = updatedPost.ImageUrl;
                existingPost.CategoryId = updatedPost.CategoryId;

                // Giữ nguyên hoặc cập nhật lại ngày chỉnh sửa tùy nhu cầu của Trang
                if (updatedPost.CreatedDate != default)
                {
                    existingPost.CreatedDate = updatedPost.CreatedDate;
                }

                _context.Posts.Update(existingPost);
                _context.SaveChanges();

                return Ok(new { message = "Cập nhật bài viết thành công", postId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật bài viết", error = ex.Message });
            }
        }

        // 6. API: Xóa bài viết khỏi hệ thống theo ID
        // DELETE: api/Posts/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết cần xóa" });
            }

            try
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();

                return Ok(new { message = "Xóa bài viết thành công khỏi cơ sở dữ liệu", postId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa bài viết", error = ex.Message });
            }
        }
    }
}