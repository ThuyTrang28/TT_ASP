/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: Web API Controller xử lý luồng Đặt hàng (Checkout) và xem Lịch sử đơn hàng cho Frontend ReactJS
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. API ĐẶT HÀNG CORE (Mục 4 đề bài) - NHẬN GIỎ HÀNG TỪ REACTJS GỬI LÊN
        // =========================================================================
        // POST: api/Orders
        [HttpPost]
        public IActionResult PlaceOrder([FromBody] OrderRequest request)
        {
            if (request == null || request.CartItems == null || !request.CartItems.Any())
            {
                return BadRequest(new { success = false, message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ." });
            }

            // Sử dụng Transaction để đảm bảo an toàn dữ liệu: Nếu một bước lỗi, toàn bộ sẽ hủy (Rollback)
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Bước 1: Tạo bản ghi mới vào bảng Order
                    var order = new Order
                    {
                        CustomerId = request.CustomerId,
                        Notes = request.Notes,
                        OrderDate = DateTime.Now, // Tự động sinh ngày đặt hiện tại
                        Status = 0 // Mặc định gán 0: Chờ duyệt theo yêu cầu đề bài
                    };

                    _context.Orders.Add(order);
                    _context.SaveChanges(); // Lưu trước để thực thể tự sinh ra Order.Id khóa chính

                    // Bước 2: Chạy vòng lặp qua danh sách giỏ hàng gửi lên để nạp vào OrderDetail
                    foreach (var item in request.CartItems)
                    {
                        // Tìm thông tin sản phẩm gốc trong DB để lấy đúng giá hiện hành và trừ kho
                        var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);
                        if (product == null)
                        {
                            return NotFound(new { success = false, message = $"Sản phẩm ID #{item.ProductId} không tồn tại trên hệ thống." });
                        }

                        // Kiểm tra tồn kho khả dụng trước khi cho phép đặt hàng
                        if (product.StockQuantity < item.Quantity)
                        {
                            return BadRequest(new { success = false, message = $"Sản phẩm '{product.Name}' hiện chỉ còn tồn {product.StockQuantity} cái, không đủ cung cấp." });
                        }

                        // Thêm vào bảng OrderDetail
                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.Id, // Gắn ID của đơn hàng vừa tạo ở bước 1
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price // Lấy đúng giá Price của sản phẩm gán vào trường UnitPrice
                        };
                        _context.OrderDetails.Add(orderDetail);

                        // Bước 3: Khấu trừ số lượng tồn kho StockQuantity của sản phẩm trong bảng Product
                        product.StockQuantity -= item.Quantity;
                        _context.Products.Update(product);
                    }

                    // Lưu toàn bộ thay đổi (Chi tiết đơn & Trừ kho) xuống SQL Server
                    _context.SaveChanges();

                    // Xác nhận hoàn thành chuỗi tiến trình thành công
                    transaction.Commit();

                    return Ok(new
                    {
                        success = true,
                        message = "Đặt hàng thành công!",
                        orderId = order.Id
                    });
                }
                catch (Exception ex)
                {
                    // Nếu xảy ra bất kỳ lỗi gì, hoàn tác lại toàn bộ dữ liệu như ban đầu
                    transaction.Rollback();
                    return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi xử lý đơn hàng.", error = ex.Message });
                }
            }
        }

        // =========================================================================
        // 2. API TRA CỨU LỊCH SỬ ĐƠN HÀNG (Mục 4 đề bài) - DÀNH CHO TRANG CÁ NHÂN KHÁCH
        // =========================================================================
        // GET: api/Orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public IActionResult GetOrderHistory(int customerId)
        {
            var history = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate) // Đơn mới nhất xếp lên đầu
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.Notes,
                    o.Status
                })
                .ToList();

            return Ok(history);
        }
    }

    // =========================================================================
    // ĐỊNH NGHĨA CÁC ĐỐI TƯỢNG DTO (DATA TRANSFER OBJECT) NHẬN DỮ LIỆU JSON TỪ FE
    // =========================================================================
    public class OrderRequest
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}