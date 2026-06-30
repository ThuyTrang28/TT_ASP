using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var banners = _context.Banners.OrderBy(b => b.DisplayOrder).ToList();
            return View(banners);
        }

        [HttpGet]
        public IActionResult Create() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Banner model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/banners/" + fileName;
            }

            _context.Banners.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 1. GET: Banner/Update/5
        // Hiển thị form chỉnh sửa với dữ liệu hiện tại của banner
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null) return NotFound();

            return View(banner);
        }

        // 2. POST: Banner/Update/5
        // Xử lý lưu thông tin sau khi chỉnh sửa
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Banner model, IFormFile? uploadImage)
        {
            var existingBanner = _context.Banners.Find(model.Id);
            if (existingBanner == null) return NotFound();

            // Nếu người dùng chọn ảnh mới, thực hiện upload và cập nhật đường dẫn
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "banners");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                existingBanner.ImageUrl = "/uploads/banners/" + fileName;
                existingBanner.TargetUrl = string.IsNullOrWhiteSpace(model.TargetUrl) ? "#" : model.TargetUrl;
            }

            // Cập nhật các trường thông tin khác
            existingBanner.Title = model.Title;
            existingBanner.SubTitle = model.SubTitle;
            existingBanner.TargetUrl = model.TargetUrl;
            existingBanner.IsActive = model.IsActive;
            existingBanner.DisplayOrder = model.DisplayOrder;

            _context.Banners.Update(existingBanner);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner != null)
            {
                _context.Banners.Remove(banner);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}