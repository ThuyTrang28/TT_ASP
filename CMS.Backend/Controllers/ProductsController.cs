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
                    p.Description, // (Nếu hàm đó có dùng)
                    p.Price,
                    // BỔ SUNG CÁC TRƯỜNG KHUYẾN MÃI MỚI
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                 ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                 : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price),
                    // --------------------------------
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(products);
        }

        // GET: api/Products/pagination?page=1&pageSize=8
        [HttpGet("pagination")]
        public IActionResult GetProductsPagination(int page = 1, int pageSize = 8)
        {
            // 1. Kiểm tra tham số đầu vào (Validation)
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 8;

            // 2. Lấy tổng số lượng sản phẩm (để Frontend tính số trang)
            var totalProducts = _context.Products.Count();

            // 3. Tính toán số trang (Math.Ceiling làm tròn lên)
            var totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);

            // 4. Lấy dữ liệu theo trang
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize) // Bỏ qua sản phẩm của các trang trước
                .Take(pageSize)              // Lấy đúng số lượng của trang hiện tại
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    // Tính toán giá cuối tại server để FE không phải tính lại
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                              ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                              : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
                               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price),
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Không có danh mục"
                })
                .ToList();

            // 5. Trả về cấu trúc JSON chuẩn (Metadata + Data)
            return Ok(new
            {
                TotalCount = totalProducts,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Data = products
            });
        }

        // 1.1 API: Lấy danh sách sản phẩm mới nhất (ví dụ: lấy 4 sản phẩm mới nhất)
        // GET: api/Products/latest/{count}
        [HttpGet("latest/{count}")]
        public IActionResult GetLatestProducts(int count)
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id) // Sắp xếp theo ID giảm dần (ID lớn nhất là mới nhất)
                .Take(count)                 // Lấy số lượng theo yêu cầu
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                 ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                 : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price),
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
                    p.ImageUrl,
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                 ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                 : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price)
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
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                 ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                 : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price),
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

                // Trả về đối tượng đã tính toán để Frontend cập nhật danh sách ngay
                var result = new
                {
                    product.Id,
                    product.Name,
                    product.Price,
                    product.DiscountAmount,
                    product.DiscountPercentage,
                    FinalPrice = (product.DiscountPercentage.HasValue && product.DiscountPercentage > 0)
                                 ? product.Price * (1 - (product.DiscountPercentage.Value / 100m))
                                 : (product.DiscountAmount.HasValue ? product.Price - product.DiscountAmount.Value : product.Price),
                    IsOnSale = (product.DiscountPercentage.HasValue && product.DiscountPercentage > 0) ||
                               (product.DiscountAmount.HasValue && product.DiscountAmount > 0 && product.DiscountAmount < product.Price)
                };

                return CreatedAtAction(nameof(GetDetail), new { id = product.Id }, result);
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
                existingProduct.DiscountAmount = updatedProduct.DiscountAmount;
                existingProduct.DiscountPercentage = updatedProduct.DiscountPercentage;
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

        // 7. API: Tìm kiếm sản phẩm theo từ khóa (Name hoặc Description)
        // GET: api/Products/search?keyword=tên_sản_phẩm
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string keyword)
        {
            // Nếu không có từ khóa, trả về danh sách trống hoặc tất cả (tùy nhu cầu)
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return Ok(new List<object>());
            }

            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p =>
                    p.Name.Contains(keyword) ||
                    (p.Description != null && p.Description.Contains(keyword))
                )
                .OrderByDescending(p => p.Id)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.DiscountAmount,
                    p.DiscountPercentage,
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                 ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                 : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price),
                    IsOnSale = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0) ||
               (p.DiscountAmount.HasValue && p.DiscountAmount > 0 && p.DiscountAmount < p.Price),
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Không có danh mục"
                })
                .ToList();

            return Ok(products);
        }

        // 8. API: Lấy gợi ý tìm kiếm (chỉ lấy tên để hiển thị nhanh)
        // GET: api/Products/suggestions?keyword=abc
        [HttpGet("suggestions")]
        public IActionResult GetSuggestions([FromQuery] string keyword)
        {
            // Kiểm tra xem keyword có nhận được không
            if (string.IsNullOrWhiteSpace(keyword)) return Ok(new List<object>());

            var data = _context.Products
                .Where(p => p.Name.Contains(keyword))
                .Take(5)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.Price,
                    // Thêm giá sau giảm nếu cần hiển thị trong dropdown gợi ý
                    FinalPrice = (p.DiscountPercentage.HasValue && p.DiscountPercentage > 0)
                         ? p.Price * (1 - (p.DiscountPercentage.Value / 100m))
                         : (p.DiscountAmount.HasValue ? p.Price - p.DiscountAmount.Value : p.Price)
                })
                .ToList();

            // Dùng console.log tại server để debug nếu cần
            Console.WriteLine($"Tìm thấy {data.Count} sản phẩm cho từ khóa: {keyword}");

            return Ok(data);
        }
    }
}