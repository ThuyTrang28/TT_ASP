using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Web.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. HIỂN THỊ DANH SÁCH
        public async Task<IActionResult> Index()
        {
            var categories = await _context.CategoriesProducts.ToListAsync();
            return View(categories);
        }

        // 2. XEM CHI TIẾT DANH MỤC (Kèm danh sách sản phẩm thuộc danh mục)
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // Eager loading để lấy kèm danh sách Products của danh mục đó
            var categoryProduct = await _context.CategoriesProducts
                .Include(c => c.Products)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (categoryProduct == null)
            {
                return NotFound();
            }

            return View(categoryProduct);
        }

        // 3. TRANG THÊM MỚI (GET)
        public IActionResult Create()
        {
            return View();
        }

        // TRANG THÊM MỚI (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CategoryProduct category)
        {
            if (ModelState.IsValid)
            {
                _context.Add(category);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Thêm danh mục sản phẩm mới thành công!";
                return RedirectToAction(nameof(Index));
            }
            TempData["ErrorMessage"] = "Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu.";
            return View(category);
        }

        // 4. TRANG SỬA (GET)
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null) return NotFound();

            return View(category);
        }

        // TRANG SỬA (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CategoryProduct category)
        {
            if (id != category.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(category);
                    await _context.SaveChangesAsync();
                    TempData["SuccessMessage"] = "Cập nhật danh mục thành công!";
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.CategoriesProducts.Any(e => e.Id == category.Id)) return NotFound();
                    else throw;
                }
            }
            TempData["ErrorMessage"] = "Cập nhật thất bại, vui lòng kiểm tra lại.";
            return View(category);
        }

        // 5. XỬ LÝ XÓA
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts.FindAsync(id);
            if (category == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy danh mục cần xóa.";
                return RedirectToAction(nameof(Index));
            }

            // Kiểm tra ràng buộc bảo vệ toàn vẹn dữ liệu
            bool hasProducts = await _context.Products.AnyAsync(p => p.CategoryProductId == id);
            if (hasProducts)
            {
                TempData["ErrorMessage"] = "Không thể xóa! Danh mục này đang chứa sản phẩm.";
                return RedirectToAction(nameof(Index));
            }

            _context.CategoriesProducts.Remove(category);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Xóa danh mục sản phẩm thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}