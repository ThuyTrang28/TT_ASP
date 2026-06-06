/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: API Controller cung cấp dữ liệu và xử lý CRUD Sản phẩm (JSON) cho Frontend
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. NHÓM API ĐỌC DỮ LIỆU (GET) - PHỤC VỤ HIỂN THỊ FRONTEND
        // =========================================================================

        // 1. API: Lấy toàn bộ danh sách sản phẩm
        // GET: api/Products
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(products);
        }

        // 2. API: Lấy danh sách sản phẩm theo Danh mục sản phẩm
        // GET: api/Products/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl
                })
                .ToList();

            return Ok(products);
        }

        // 3. API: Lấy chi tiết một sản phẩm theo ID
        // GET: api/Products/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Không có danh mục"
                })
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }

        // =========================================================================
        // 2. NHÓM API THAY ĐỔI DỮ LIỆU (POST, PUT, DELETE) - PHỤC VỤ QUẢN TRỊ ADMIN
        // =========================================================================

        // 4. API: Thêm mới một sản phẩm
        // POST: api/Products
        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest(new { message = "Dữ liệu sản phẩm gửi lên không hợp lệ" });
            }

            try
            {
                _context.Products.Add(product);
                _context.SaveChanges();

                // Trả về mã trạng thái 201 Created kèm theo đường dẫn lấy chi tiết
                return CreatedAtAction(nameof(GetDetail), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu sản phẩm", error = ex.Message });
            }
        }

        // 5. API: Cập nhật thông tin sản phẩm theo ID
        // PUT: api/Products/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product updatedProduct)
        {
            if (updatedProduct == null)
            {
                return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ" });
            }

            // Tìm sản phẩm gốc hiện có trong SQL Server
            var existingProduct = _context.Products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm cần cập nhật" });
            }

            try
            {
                // Đồng bộ các thuộc tính thay đổi từ body request sang database
                existingProduct.Name = updatedProduct.Name;
                existingProduct.Description = updatedProduct.Description;
                existingProduct.Price = updatedProduct.Price;
                existingProduct.StockQuantity = updatedProduct.StockQuantity;
                existingProduct.ImageUrl = updatedProduct.ImageUrl;
                existingProduct.CategoryProductId = updatedProduct.CategoryProductId;

                _context.Products.Update(existingProduct);
                _context.SaveChanges();

                return Ok(new { message = "Cập nhật sản phẩm thành công", productId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật sản phẩm", error = ex.Message });
            }
        }

        // 6. API: Xóa sản phẩm ra khỏi hệ thống theo ID
        // DELETE: api/Products/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm cần xóa" });
            }

            try
            {
                _context.Products.Remove(product);
                _context.SaveChanges();

                return Ok(new { message = "Xóa sản phẩm thành công khỏi cơ sở dữ liệu", productId = id });
            }
            catch (Exception ex)
            {
                // Tránh crash ứng dụng nếu sản phẩm đã lọt vào bảng OrderDetail (ràng buộc khóa ngoại)
                return StatusCode(500, new
                {
                    message = "Không thể xóa sản phẩm này do đã phát sinh lịch sử giao dịch đơn hàng liên quan.",
                    error = ex.Message
                });
            }
        }
    }
}