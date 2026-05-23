/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Sử dụng kỹ thuật .Include() để nạp kèm dữ liệu danh mục (Category) tránh lỗi Null ở trang Index và Details
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC phải có dòng này để dùng được hàm .Include()
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action hiển thị danh sách bài viết kèm tên danh mục
        public IActionResult Index()
        {
            // CỰC KỲ QUAN TRỌNG: Include bảng Category vào truy vấn và sắp xếp mới nhất lên đầu
            var posts = _context.Posts
                                .Include(p => p.Category)
                                .OrderByDescending(p => p.CreatedDate)
                                .ToList();

            return View(posts);
        }

        // Action Xem chi tiết bài viết (Yêu cầu 1 của Lab)
        public IActionResult Details(int id)
        {
            // Tương tự, dùng Include để nạp dữ liệu bảng Category liên kết sang trang chi tiết bài viết
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}