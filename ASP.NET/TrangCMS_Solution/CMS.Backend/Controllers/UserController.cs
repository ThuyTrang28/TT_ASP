using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System.Collections.Generic;

public class UserController : Controller
{
    public IActionResult Index()
    {
        // Tạo danh sách dữ liệu mẫu người dùng dựa trên thực thể bạn cung cấp
        // Lưu ý: Đối với mật khẩu thực tế sẽ mã hóa (Hash), ở đây là dữ liệu mẫu demo
        var list = new List<User>
        {
            new User {
                Id = 1,
                Username = "admin_trang",
                PasswordHash = "A6xn92...",
                FullName = "Lê Nguyễn Thùy Trang",
                Role = "Quản trị viên"
            },
            new User {
                Id = 2,
                Username = "editor_nguyen",
                PasswordHash = "B7yt31...",
                FullName = "Nguyễn Văn Biên Tập",
                Role = "Biên tập viên"
            },
            new User {
                Id = 3,
                Username = "editor_hoa",
                PasswordHash = "C9pl12...",
                FullName = "Trần Thị Hoa",
                Role = "Biên tập viên"
            }
        };

        return View(list); // Truyền danh sách người dùng sang giao diện
    }
}