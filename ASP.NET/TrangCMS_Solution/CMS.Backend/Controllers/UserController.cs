/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Bước 2 - Quản lý thành viên lấy dữ liệu trực tiếp từ Database
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Thư mục chứa file ApplicationDbContext của bạn
using CMS.Data.Entities; // Thư mục chứa thực thể User
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // 1. Khai báo biến ngữ cảnh cơ sở dữ liệu để kết nối SQL Server
        private readonly ApplicationDbContext _context;

        // 2. Thực hiện "Tiêm" ApplicationDbContext thông qua hàm khởi tạo (Constructor Injection)
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. Viết Action Index() để lấy danh sách dữ liệu người dùng thật từ Database
        public IActionResult Index()
        {
            // Lấy toàn bộ danh sách thành viên từ bảng Users trong SQL Server
            var users = _context.Users.ToList();

            // Gửi danh sách dữ liệu thật này sang View hiển thị giao diện
            return View(users);
        }
    }
}