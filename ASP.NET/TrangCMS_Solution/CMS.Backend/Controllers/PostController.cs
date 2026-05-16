using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System;
using System.Collections.Generic;

public class PostController : Controller
{
    public IActionResult Index()
    {
        // Tạo danh sách dữ liệu mẫu dựa trên các thuộc tính bạn đã định nghĩa
        var list = new List<Post>
        {
            new Post {
                Id = 1,
                Title = "Lộ trình học ASP.NET Core cho người mới",
                Content = "Nội dung bài viết về lộ trình học .NET...",
                CreatedDate = new DateTime(2026, 4, 7),
                ImageUrl = "/images/thumb1.jpg" // Sử dụng ImageUrl thay cho Thumbnail
            },
            new Post {
                Id = 2,
                Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
                Content = "Nội dung bài viết về sự kết hợp React và A...",
                CreatedDate = new DateTime(2026, 4, 6),
                ImageUrl = "/images/thumb2.jpg"
            },
            new Post {
                Id = 3,
                Title = "Hướng dẫn cài đặt môi trường Visual Studio",
                Content = "Các bước cài đặt công cụ cần thiết cho lập...",
                CreatedDate = new DateTime(2026, 4, 5),
                ImageUrl = "/images/thumb3.jpg"
            }
        };

        return View(list); // Gửi danh sách này sang View Index.cshtml
    }
}