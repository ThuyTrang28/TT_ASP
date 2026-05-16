/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 16/05/2026
 * Mô tả: Điều hướng và xử lý logic cho thực thể bài viết (Danh sách & Chi tiết)
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

public class PostController : Controller
{
    // Sử dụng Static List để dữ liệu mẫu được lưu giữ lại khi chuyển giữa trang Index và Details
    private static List<Post> _mockPosts = new List<Post>
    {
        new Post {
            Id = 1,
            Title = "Lộ trình học ASP.NET Core cho người mới",
            Content = "Nội dung bài viết về lộ trình học .NET hoàn chỉnh từ cơ bản đến nâng cao. Bạn sẽ được học về MVC, Web API, Entity Framework Core và cách triển khai dự án thực tế...",
            CreatedDate = new DateTime(2026, 4, 7),
            ImageUrl = "/images/thumb1.jpg"
        },
        new Post {
            Id = 2,
            Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
            Content = "Nội dung bài viết về sự kết hợp giữa ReactJS ở Front-end và ASP.NET Core Web API ở Back-end giúp xây dựng các ứng dụng Web mượt mà, tối ưu hiệu năng cao...",
            CreatedDate = new DateTime(2026, 4, 6),
            ImageUrl = "/images/thumb2.jpg"
        },
        new Post {
            Id = 3,
            Title = "Hướng dẫn cài đặt môi trường Visual Studio",
            Content = "Các bước cài đặt công cụ cần thiết cho lập trình C# và .NET. Hướng dẫn chi tiết cách chọn các Workload như 'ASP.NET and web development' để bắt đầu học tập...",
            CreatedDate = new DateTime(2026, 4, 5),
            ImageUrl = "/images/thumb3.jpg"
        }
    };

    // 1. Action hiển thị danh sách tất cả bài viết bài viết
    public IActionResult Index()
    {
        return View(_mockPosts); // Gửi danh sách dữ liệu mẫu sang View Index.cshtml
    }

    // 2. Action hiển thị chi tiết 1 bài viết dựa trên Id nhận từ URL
    public IActionResult Details(int id)
    {
        // Tìm bài viết trong danh sách mẫu có Id trùng với id được truyền vào
        var post = _mockPosts.FirstOrDefault(p => p.Id == id);

        // Nếu không tìm thấy bài viết (Id không hợp lệ), trả về trang lỗi 404 NotFound
        if (post == null)
        {
            return NotFound();
        }

        return View(post); // Gửi duy nhất đối tượng bài viết tìm được sang View Details.cshtml
    }
}