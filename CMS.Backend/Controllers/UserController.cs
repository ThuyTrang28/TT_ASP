/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Controller quản lý thành viên (CRUD: Index, Create, Edit, Delete)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Hiển thị danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // 2. Form tạo mới (GET)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 3. Xử lý lưu thành viên mới (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 4. Form chỉnh sửa (GET)
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return View(user);
        }

        // 5. Xử lý cập nhật (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(User model, string NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null) return NotFound();

            // Nếu nhập mật khẩu mới thì cập nhật, không thì giữ mật khẩu cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 6. Xóa thành viên
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}