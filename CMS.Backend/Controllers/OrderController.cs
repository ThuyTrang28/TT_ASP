/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: Điều hướng và quản lý trạng thái Đơn hàng (Order)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Web.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. HIỂN THỊ DANH SÁCH ĐƠN HÀNG
        public async Task<IActionResult> Index()
        {
            // Dùng .Include để lấy thông tin Khách hàng mua đơn đó
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return View(orders);
        }

        // 2. XEM CHI TIẾT ĐƠN HÀNG (Kèm danh sách sản phẩm đã mua)
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product) // Nếu bảng OrderDetail có liên kết Product
                .FirstOrDefaultAsync(m => m.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG NHANH
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            // Cập nhật trạng thái (0: Chờ duyệt, 1: Đang giao, 2: Đã xong, hoặc cập nhật tùy ý)
            order.Status = status;
            _context.Update(order);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Cập nhật trạng thái đơn hàng #{id} thành công!";
            return RedirectToAction(nameof(Index));
        }

        // 4. XỬ LÝ XÓA ĐƠN HÀNG
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy đơn hàng cần xóa.";
                return RedirectToAction(nameof(Index));
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "Xóa đơn hàng thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}