/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 06/06/2026
 * Mô tả: Nhóm API Tài khoản Khách hàng (Đăng ký & Đăng nhập phục vụ Frontend) theo đúng yêu cầu đề bài
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo chứa thực thể Customer

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // ● POST /api/Auth/CustomerRegister
        // Nhiệm vụ: Nhận dữ liệu gồm FullName, Email, Password (lưu thô tối giản), 
        //           Phone, Address để thêm mới một khách hàng vào bảng Customer.
        // Sử dụng ở FE: Dùng cho trang Đăng ký tài khoản.
        // =========================================================================
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] CustomerRegisterDto model)
        {
            if (model == null)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            // Kiểm tra trùng lặp Email trong hệ thống
            var isExist = await _context.Customers.AnyAsync(c => c.Email == model.Email);
            if (isExist)
            {
                return BadRequest(new { success = false, message = "Email này đã được đăng ký tài khoản!" });
            }

            try
            {
                // Thêm mới một khách hàng vào bảng Customer (lưu thô mật khẩu tối giản)
                var customer = new Customer
                {
                    FullName = model.FullName,
                    Email = model.Email,
                    Password = model.Password, // Lưu thô tối giản theo yêu cầu đề bài
                    Phone = model.Phone,
                    Address = model.Address
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Đăng ký tài khoản khách hàng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống khi đăng ký.", error = ex.Message });
            }
        }

        // =========================================================================
        // ● POST /api/Auth/CustomerLogin
        // Nhiệm vụ: Kiểm tra Email và Password trong bảng Customer. 
        //           Nếu đúng, trả về thông tin khách hàng (kèm theo CustomerId).
        // Sử dụng ở FE: Dùng cho trang Đăng nhập để hệ thống nhận diện ai đang mua hàng.
        // =========================================================================
        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginDto model)
        {
            if (model == null)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });
            }

            // Kiểm tra thông tin Email và Password trong bảng Customer
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == model.Email && c.Password == model.Password);

            if (customer == null)
            {
                return Unauthorized(new { success = false, message = "Email hoặc Mật khẩu không chính xác!" });
            }

            // Trả về thông tin khách hàng kèm theo CustomerId (Id) để hệ thống nhận diện ai đang mua hàng
            return Ok(new
            {
                success = true,
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address,
                message = "Đăng nhập thành công!"
            });
        }

        // =========================================================================
        // ● GET /api/Auth/CustomerProfile/{id}
        // Nhiệm vụ: Lấy thông tin chi tiết của một khách hàng dựa trên ID
        // =========================================================================
        [HttpGet("CustomerProfile/{id}")]
        public async Task<IActionResult> GetCustomerProfile(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy khách hàng." });
            }

            return Ok(new
            {
                success = true,
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        // =========================================================================
        // ● PUT /api/Auth/UpdateProfile
        // Nhiệm vụ: Cập nhật thông tin FullName, Phone, Address của khách hàng
        // =========================================================================
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerUpdateDto model)
        {
            var customer = await _context.Customers.FindAsync(model.Id);
            if (customer == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy khách hàng." });
            }

            customer.FullName = model.FullName;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật thông tin thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật.", error = ex.Message });
            }
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var customer = await _context.Customers.FindAsync(model.Id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy người dùng." });

            // Kiểm tra mật khẩu cũ (Vì đề bài yêu cầu lưu thô, nên so sánh trực tiếp)
            if (customer.Password != model.OldPassword)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác!" });
            }

            customer.Password = model.NewPassword;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }
    }

    // =========================================================================
    // CÁC ĐỐI TƯỢNG DTO (DATA TRANSFER OBJECT) NHẬN DỮ LIỆU JSON TỪ FRONTEND
    // =========================================================================
    public class CustomerRegisterDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // Nhận mật khẩu thô gửi lên từ client
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class CustomerLoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class CustomerUpdateDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class ChangePasswordDto
    {
        public int Id { get; set; }
        public string OldPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}