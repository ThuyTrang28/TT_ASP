/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: Web API Controller xử lý luồng Đặt hàng (Checkout) và xem Lịch sử đơn hàng cho Frontend ReactJS
 */

using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services; // Thư viện chứa VnPayLibrary
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrdersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // =========================================================================
        // 1. API ĐẶT HÀNG CORE
        // =========================================================================
        [HttpPost]
        public IActionResult PlaceOrder([FromBody] OrderRequest request)
        {
            if (request == null || request.CartItems == null || !request.CartItems.Any())
            {
                return BadRequest(new { success = false, message = "Giỏ hàng trống hoặc dữ liệu không hợp lệ." });
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var order = new Order
                    {
                        CustomerId = request.CustomerId,
                        Notes = request.Notes,
                        OrderDate = DateTime.Now,
                        Status = 0, // Chờ duyệt
                        ShippingName = request.ShippingName,
                        ShippingPhone = request.ShippingPhone,
                        ShippingAddress = request.ShippingAddress,
                        PaymentMethod = request.PaymentMethod
                    };

                    _context.Orders.Add(order);
                    _context.SaveChanges();

                    decimal totalAmount = 0; // Biến tính tổng tiền cho VNPAY

                    foreach (var item in request.CartItems)
                    {
                        var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);
                        if (product == null)
                            return NotFound(new { success = false, message = $"Sản phẩm ID #{item.ProductId} không tồn tại." });

                        if (product.StockQuantity < item.Quantity)
                            return BadRequest(new { success = false, message = $"Sản phẩm '{product.Name}' không đủ tồn kho." });

                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };
                        _context.OrderDetails.Add(orderDetail);

                        totalAmount += (product.Price * item.Quantity);
                        product.StockQuantity -= item.Quantity;
                        _context.Products.Update(product);
                    }

                    _context.SaveChanges();
                    transaction.Commit();

                    // Xử lý VNPAY nếu phương thức thanh toán là VNPAY
                    if (request.PaymentMethod == "VNPAY")
                    {
                        string paymentUrl = CreateVnPayUrl(order.Id, totalAmount);
                        return Ok(new { success = true, paymentUrl = paymentUrl });
                    }

                    return Ok(new { success = true, message = "Đặt hàng thành công!" });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, new { success = false, message = "Lỗi hệ thống.", error = ex.Message });
                }
            }
        }

        // =========================================================================
        // HÀM HỖ TRỢ THANH TOÁN VNPAY
        // =========================================================================
        private string CreateVnPayUrl(int orderId, decimal amount)
        {
            var vnpayConfig = _configuration.GetSection("VnPay");
            var vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            string? tmnCode = vnpayConfig["TmnCode"];

            if (!string.IsNullOrEmpty(tmnCode))
            {
                vnpay.AddRequestData("vnp_TmnCode", tmnCode);
            }
            else
            {
                // Bạn có thể log lỗi hoặc ném ra ngoại lệ nếu thiếu cấu hình quan trọng này
                throw new Exception("Cấu hình TmnCode trong appsettings.json bị thiếu hoặc trống!");
            }
            vnpay.AddRequestData("vnp_Amount", ((long)(amount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            // Thay dòng vnpay.AddRequestData("vnp_IpAddr", ...) bằng:
            // 1. Sử dụng ?. để truy cập an toàn
            // 2. Sử dụng ?? để gán IP mặc định nếu RemoteIpAddress là null
            string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

            // 3. Xử lý trường hợp IPv6 trên localhost (Thường trả về ::1)
            if (ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }

            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {orderId}");
            vnpay.AddRequestData("vnp_ReturnUrl", vnpayConfig["ReturnUrl"] ?? "");
            vnpay.AddRequestData("vnp_TxnRef", orderId.ToString());
            vnpay.AddRequestData("vnp_OrderType", "other");

            return vnpay.CreateRequestUrl(
                 vnpayConfig["BaseUrl"] ?? "",
                 vnpayConfig["HashSecret"] ?? ""
             );
        }

        // =========================================================================
        // 2. API TRA CỨU LỊCH SỬ ĐƠN HÀNG (ĐÃ CẬP NHẬT)
        // =========================================================================
        [HttpGet("customer/{customerId}")]
        public IActionResult GetOrderHistory(int customerId)
        {
            // 1. Lấy dữ liệu từ DB, bao gồm cả chi tiết đơn hàng
            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            // 2. Chuyển đổi sang object JSON chứa đầy đủ thông tin cần thiết
            var result = orders.Select(o => new
            {
                id = o.Id,
                orderDate = o.OrderDate,
                status = o.Status,
                paymentMethod = o.PaymentMethod, // THÊM TRƯỜNG NÀY ĐỂ FRONTEND NHẬN ĐƯỢC
                totalPrice = o.OrderDetails.Sum(od => od.UnitPrice * od.Quantity)
            }).ToList();

            return Ok(result);
        }

        // =========================================================================
        // 3. API XỬ LÝ PHẢN HỒI TỪ VNPAY
        // =========================================================================
        [HttpGet("vnpay-return")]
        public IActionResult VnPayReturn()
        {
            var vnpayData = Request.Query;
            var vnpayConfig = _configuration.GetSection("VnPay");
            var vnpay = new VnPayLibrary();

            foreach (var key in vnpayData.Keys)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    string value = vnpayData[key].ToString();
                    vnpay.AddRequestData(key, value);
                }
            }

            if (!vnpayData.TryGetValue("vnp_SecureHash", out var secureHashValue))
            {
                return BadRequest("Thiếu chữ ký bảo mật (vnp_SecureHash).");
            }
            string vnp_SecureHash = secureHashValue.ToString();
            string? hashSecret = vnpayConfig["HashSecret"];

            if (string.IsNullOrEmpty(hashSecret))
            {
                return StatusCode(500, "Cấu hình VnPay HashSecret chưa được thiết lập.");
            }

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, hashSecret);

            if (checkSignature)
            {
                if (!vnpayData.TryGetValue("vnp_TxnRef", out var txnRefValue))
                {
                    return BadRequest("Không tìm thấy mã đơn hàng trong phản hồi.");
                }
                string orderId = txnRefValue.ToString();
                if (!vnpayData.TryGetValue("vnp_ResponseCode", out var responseCodeValue))
                {
                    return BadRequest("Thiếu mã phản hồi từ VNPAY.");
                }
                string vnp_ResponseCode = responseCodeValue.ToString();

                if (vnp_ResponseCode == "00") // Thanh toán thành công
                {
                    var order = _context.Orders.Find(int.Parse(orderId));
                    if (order != null)
                    {
                        order.Status = 1; // Cập nhật trạng thái đã thanh toán
                        _context.SaveChanges();
                    }
                    return Redirect("http://localhost:5173/order-success");
                }
            }
            return Redirect("http://localhost:5173/order-failed");
        }

        [HttpPost("cancel/{orderId}")]
        public IActionResult CancelOrder(int orderId)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);

            if (order == null) return NotFound("Không tìm thấy đơn hàng.");

            // Chỉ cho phép hủy nếu trạng thái là 0 (Chờ duyệt)
            if (order.Status != 0)
                return BadRequest("Chỉ có thể hủy đơn hàng khi đang ở trạng thái 'Chờ duyệt'.");

            order.Status = 3; // Cập nhật trạng thái thành Đã hủy
            _context.SaveChanges();

            return Ok(new { message = "Hủy đơn hàng thành công!" });
        }
    }

    public class OrderRequest
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public string ShippingName { get; set; } = string.Empty;
        public string ShippingPhone { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "COD";
        public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}