using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API lấy danh sách Banner đang hoạt động để hiển thị lên Slider/Carousel
        // GET: api/Banners
        [HttpGet]
        public IActionResult GetActiveBanners()
        {
            var banners = _context.Banners
                .Where(b => b.IsActive) // Chỉ lấy banner đang bật
                .OrderBy(b => b.DisplayOrder) // Sắp xếp theo thứ tự ưu tiên
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.SubTitle,
                    b.ImageUrl,
                    b.TargetUrl,
                    b.IsActive 
                })
                .ToList();

            return Ok(banners);
        }

        // API lấy chi tiết một Banner
        // GET: api/Banners/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var banner = _context.Banners.FirstOrDefault(b => b.Id == id);
            if (banner == null) return NotFound(new { message = "Không tìm thấy banner" });

            return Ok(banner);
        }

        // =========================================================================
        // NHÓM API THAY ĐỔI DỮ LIỆU (POST, PUT, DELETE) - PHỤC VỤ QUẢN TRỊ
        // =========================================================================

        // 3. API: Thêm mới một banner
        // POST: api/Banners
        [HttpPost]
        public IActionResult Create([FromBody] Banner banner)
        {
            if (banner == null)
            {
                return BadRequest(new { message = "Dữ liệu banner không hợp lệ" });
            }

            try
            {
                _context.Banners.Add(banner);
                _context.SaveChanges();

                return CreatedAtAction(nameof(GetDetail), new { id = banner.Id }, banner);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu banner", error = ex.Message });
            }
        }

        // 4. API: Cập nhật thông tin banner theo ID
        // PUT: api/Banners/{id}
        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] Banner updatedBanner)
        {
            if (updatedBanner == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ" });
            }

            var existingBanner = _context.Banners.FirstOrDefault(b => b.Id == id);
            if (existingBanner == null)
            {
                return NotFound(new { message = "Không tìm thấy banner cần cập nhật" });
            }

            try
            {
                existingBanner.Title = updatedBanner.Title;
                existingBanner.SubTitle = updatedBanner.SubTitle;
                existingBanner.ImageUrl = updatedBanner.ImageUrl;
                existingBanner.TargetUrl = updatedBanner.TargetUrl;
                existingBanner.IsActive = updatedBanner.IsActive;
                existingBanner.DisplayOrder = updatedBanner.DisplayOrder;

                _context.Banners.Update(existingBanner);
                _context.SaveChanges();

                return Ok(new { message = "Cập nhật banner thành công", bannerId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật banner", error = ex.Message });
            }
        }

        // 5. API: Xóa banner khỏi hệ thống theo ID
        // DELETE: api/Banners/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.FirstOrDefault(b => b.Id == id);
            if (banner == null)
            {
                return NotFound(new { message = "Không tìm thấy banner cần xóa" });
            }

            try
            {
                _context.Banners.Remove(banner);
                _context.SaveChanges();

                return Ok(new { message = "Xóa banner thành công", bannerId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi xóa banner", error = ex.Message });
            }
        }
    }
}