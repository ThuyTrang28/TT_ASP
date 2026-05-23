/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Tiêm DbContext và sử dụng cú pháp LINQ (OrderByDescending, Take) để lấy 3 bài viết mới nhất lên trang chủ
 */

using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // 🚨 BẮT BUỘC có dòng này để chạy được hàm .Include()
using CMS.Data; // Thư mục chứa file ApplicationDbContext của bạn
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context; // 🚨 Khai báo thêm biến kết nối Cơ sở dữ liệu

        // 🚨 Tiến hành "Tiêm" cả ILogger và ApplicationDbContext vào hàm khởi tạo (Constructor)
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Action hiển thị Trang chủ: Đã cập nhật logic lấy 3 bài viết mới nhất theo Lab
        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất từ Database
            var latestPosts = _context.Posts
                                      .Include(p => p.Category)           // Lấy kèm thực thể danh mục để hiển thị tên Chuyên mục
                                      .OrderByDescending(p => p.CreatedDate) // Sắp xếp theo ngày đăng giảm dần (mới nhất lên đầu)
                                      .Take(3)                            // Chỉ cắt lấy đúng 3 bản tin đầu tiên
                                      .ToList();

            // Gửi danh sách 3 bài viết này sang View Index.cshtml thuộc thư mục Views/Home
            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}