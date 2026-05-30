using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(string username, string password)
    {
        // 1. Kiểm tra tài khoản trong Database
        var user = _context.Users.FirstOrDefault(u => u.Username == username && u.PasswordHash == password);

        if (user != null)
        {
            // 2. Thiết lập danh tính (Claims)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role), // Admin hoặc Editor
                new Claim("FullName", user.FullName)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true
            };

            // 3. Đăng nhập và lưu Cookie
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity), authProperties);

            return RedirectToAction("Index", "Dashboard");
        }

        ModelState.AddModelError("", "Tên đăng nhập hoặc mật khẩu không đúng.");
        return View();
    }

    // Hàm đăng xuất (đã cập nhật)
    public async Task<IActionResult> Logout()
    {
        // Xóa cookie khỏi trình duyệt người dùng
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        // Chuyển hướng về trang đăng nhập
        return RedirectToAction("Login", "Account");
    }

    public IActionResult AccessDenied()
    {
        return View();
    }
}