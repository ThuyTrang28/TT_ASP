/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày tạo: 30/05/2026
 * Mô tả: API Controller quản lý danh sách và thông tin khách hàng (RESTful)
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Customers (Lấy toàn bộ danh sách khách hàng)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            // Tạm thời chặn không trả về danh sách Order đi kèm để tránh vòng lặp JSON vô hạn (Reference Loop)
            return await _context.Customers.ToListAsync();
        }

        // 2. GET: api/Customers/5 (Lấy chi tiết 1 khách hàng theo ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(new { message = $"Không tìm thấy khách hàng có ID = {id}" });
            }

            return customer;
        }

        // 3. POST: api/Customers (Thêm mới một khách hàng)
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra trùng lặp Email nếu cần thiết để bảo vệ logic hệ thống
            bool emailExists = await _context.Customers.AnyAsync(c => c.Email == customer.Email);
            if (emailExists)
            {
                return BadRequest(new { message = "Email này đã được sử dụng bởi một khách hàng khác." });
            }

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // Trả về mã trạng thái 201 Created kèm theo đường dẫn gọi lại hàm GetCustomer
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // 4. PUT: api/Customers/5 (Cập nhật thông tin khách hàng)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.Id)
            {
                return BadRequest(new { message = "Mã ID truyền vào không khớp với dữ liệu thực thể." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound(new { message = $"Không thể cập nhật do khách hàng có ID = {id} không tồn tại." });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Cập nhật thông tin khách hàng thành công!", data = customer });
        }

        // 5. DELETE: api/Customers/5 (Xóa khách hàng)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = $"Không tìm thấy khách hàng có ID = {id} để xóa." });
            }

            // (Tùy chọn nâng cao nếu có bảng Order): Kiểm tra ràng buộc nếu khách hàng đã có đơn hàng thì không cho xóa trực tiếp
            // bool hasOrders = await _context.Orders.AnyAsync(o => o.CustomerId == id);
            // if (hasOrders) { return BadRequest(new { message = "Không thể xóa khách hàng này vì lịch sử đã có đơn hàng liên kết." }); }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thông tin khách hàng thành công!" });
        }

        // 6. GET: api/Customers/Profile/5
        [HttpGet("Profile/{id}")]
        public async Task<ActionResult<Customer>> GetProfile(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy hồ sơ cá nhân." });
            }
            // Chỉ trả về các trường cần thiết, tránh lộ mật khẩu hoặc dữ liệu nhạy cảm
            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Email,
                customer.Phone,
                customer.Address
            });
        }

        // 7. PUT: api/Customers/UpdateProfile
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile(Customer updatedCustomer)
        {
            var customer = await _context.Customers.FindAsync(updatedCustomer.Id);
            if (customer == null) return NotFound();

            // Cập nhật các trường cho phép sửa
            customer.FullName = updatedCustomer.FullName;
            customer.Phone = updatedCustomer.Phone;
            customer.Address = updatedCustomer.Address;
            // Không cho phép sửa Email hoặc Password ở đây nếu không có logic xác thực riêng

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thông tin cá nhân thành công!" });
        }
        // Hàm bổ trợ kiểm tra nhanh sự tồn tại của ID
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}