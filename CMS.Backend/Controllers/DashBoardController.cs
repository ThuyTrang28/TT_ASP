using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize] // Chỉ cho phép người đã đăng nhập mới được vào đây
public class DashboardController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}