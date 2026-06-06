/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày sửa: 23/05/2026
 * Mô tả: Web API Controller xử lý Đăng ký, Đăng nhập và CRUD Thành viên sử dụng thực thể User (JSON)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo gọi đúng Namespace chứa thực thể User của bạn

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. NHÓM API ĐĂNG KÝ / ĐĂNG NHẬP PHỤC VỤ CLIENT FRONTEND
        // =========================================================================

        // ● POST: api/Users/Register
        [HttpPost("Register")]
        public IActionResult Register([FromBody] UserRegisterDto model)
        {
            if (model == null) return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            // Kiểm tra tên đăng nhập (Username) đã tồn tại trong hệ thống chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                return BadRequest(new { message = "Tên đăng nhập này đã có người dùng!" });
            }

            try
            {
                var user = new User
                {
                    Username = model.Username,
                    PasswordHash = model.Password, // Lưu thô tối giản theo logic bài học của Trang
                    FullName = model.FullName
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(new { success = true, message = "Đăng ký tài khoản thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi đăng ký thành viên.", error = ex.Message });
            }
        }

        // ● POST: api/Users/Login
        [HttpPost("Login")]
        public IActionResult Login([FromBody] UserLoginDto model)
        {
            if (model == null) return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            // Xác thực thông tin Username và PasswordHash trong bảng Users
            var user = _context.Users
                .FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc Mật khẩu không chính xác!" });
            }

            // Trả về dữ liệu đối tượng JSON cho ReactJS xử lý lưu trữ trạng thái đăng nhập
            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                fullName = user.FullName,
                message = "Đăng nhập thành công!"
            });
        }

        // =========================================================================
        // 2. NHÓM API CRUD QUẢN LÝ THÀNH VIÊN (KẾ THỪA TỪ MVC CONTROLLER)
        // =========================================================================

        // 1. API: Hiển thị danh sách thành viên (JSON)
        // GET: api/Users
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .OrderByDescending(u => u.Id)
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.FullName
                })
                .ToList();

            return Ok(users);
        }

        // 2. API: Lấy thông tin chi tiết một thành viên theo ID
        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var user = _context.Users
                .Select(u => new { u.Id, u.Username, u.FullName })
                .FirstOrDefault(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy thành viên này trong hệ thống." });
            }

            return Ok(user);
        }

        // 3. API: Xử lý cập nhật thông tin thành viên
        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserUpdateDto model)
        {
            if (model == null) return BadRequest(new { message = "Dữ liệu cập nhật không hợp lệ." });

            var existingUser = _context.Users.FirstOrDefault(u => u.Id == id);
            if (existingUser == null) return NotFound(new { message = "Không tìm thấy thành viên để cập nhật." });

            try
            {
                // Cập nhật các thông tin cơ bản
                existingUser.FullName = model.FullName;

                // Nếu nhập mật khẩu mới (NewPassword) thì cập nhật, không thì giữ nguyên mật khẩu cũ như file MVC gốc
                if (!string.IsNullOrEmpty(model.NewPassword))
                {
                    existingUser.PasswordHash = model.NewPassword;
                }

                _context.Users.Update(existingUser);
                _context.SaveChanges();

                return Ok(new { message = "Cập nhật thông tin thành viên thành công!", userId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi cập nhật dữ liệu.", error = ex.Message });
            }
        }

        // 4. API: Xóa thành viên theo ID
        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy thành viên cần xóa." });
            }

            try
            {
                _context.Users.Remove(user);
                _context.SaveChanges();

                return Ok(new { message = "Xóa thành viên thành công khỏi cơ sở dữ liệu.", userId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Không thể xóa thành viên này do có ràng buộc dữ liệu liên quan.", error = ex.Message });
            }
        }
    }

    // =========================================================================
    // CÁC ĐỐI TƯỢNG DTO (DATA TRANSFER OBJECT) NHẬN DỮ LIỆU TỪ FRONTEND
    // =========================================================================
    public class UserRegisterDto
    {
        public string Username { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UserUpdateDto
    {
        public string FullName { get; set; } = null!;
        public string? NewPassword { get; set; } // Nhận mật khẩu mới nếu muốn thay đổi
    }
}