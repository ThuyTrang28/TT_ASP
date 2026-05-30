/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Ngày tạo: 16/05/2026
 * Mô tả: Quản lý thực thể đơn hàng
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; }

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}

