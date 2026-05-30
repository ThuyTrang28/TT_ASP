/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Tích hợp đầy đủ tính năng hiển thị danh sách, thêm mới, xóa có ràng buộc và cập nhật dữ liệu (Update) cho Danh mục
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data; // Thư mục chứa file ApplicationDbContext của bạn
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;// Thư mục chứa lớp thực thể Category
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào Controller thông qua Constructor Injection
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action Index: Hiển thị danh sách toàn bộ danh mục thực tế từ SQL Server
        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();

            // Gửi danh sách danh mục sang View Index.cshtml của thư mục Category
            return View(data);
        }

        // ==========================================
        // 3.2. THÊM MỚI DỮ LIỆU (CREATE)
        // ==========================================

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho người dùng nhập liệu
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và tiến hành lưu vào SQL Server
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.Categories.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động điều hướng quay về trang danh sách Index
            return RedirectToAction("Index");
        }

        // ==========================================
        // 3.3. XÓA MỘT DANH MỤC (DELETE) - CÓ CHẶN RÀNG BUỘC
        // ==========================================

        // Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = _context.Categories.Find(id);

            // Kiểm tra nếu tìm thấy thì mới xử lý tiếp
            if (category != null)
            {
                // ĐIỀU KIỆN GÁC CỔNG: Kiểm tra xem có bài viết nào đang dùng CategoryId này không
                bool hasPosts = _context.Posts.Any(p => p.CategoryId == id);

                if (hasPosts)
                {
                    // Thêm câu thông báo lỗi vào TempData khi không được phép xóa
                    TempData["ErrorMessage"] = "Không thể xóa danh mục này vì hiện tại đang có các bài viết thuộc danh mục quản lý. Vì theo logic, không thể có bài viết mà không có danh mục quản lý. Cần xóa hết bài viết thuộc danh mục đó trước khi xóa danh mục cha.";
                    return RedirectToAction("Index");
                }

                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking) nếu danh mục hoàn toàn trống
                _context.Categories.Remove(category);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                _context.SaveChanges();

                // Thông báo thành công nếu xóa danh mục trống hợp lệ
                TempData["SuccessMessage"] = "Xóa danh mục thành công!";
            }

            return RedirectToAction("Index");
        }

        // ==========================================
        // 3.4. THỰC HIỆN CHỈNH SỬA DỮ LIỆU (UPDATE)
        // ==========================================

        // 1. Hàm GET: Tìm dữ liệu cũ dựa vào Id truyền từ nút bấm và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo Id
            var category = _context.Categories.Find(id);

            if (category == null)
            {
                return NotFound();
            }

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit.cshtml
        }

        // 2. Hàm POST: Nhận dữ liệu mới đã chỉnh sửa từ Form của người dùng gửi lên và lưu lại
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.Categories.Update(model);

            // Lưu thay đổi thực sự xuống SQL Server
            _context.SaveChanges();

            // Tạo thông báo lưu chỉnh sửa thành công
            TempData["SuccessMessage"] = $"Cập nhật thay đổi cho danh mục '{model.Name}' thành công!";

            // Quay lại trang danh sách để xem kết quả cập nhật mới
            return RedirectToAction("Index");
        }
    }
}