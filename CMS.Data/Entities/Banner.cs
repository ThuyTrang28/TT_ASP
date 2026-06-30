using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Banner
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string SubTitle { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng chọn hình ảnh")]
        public string ImageUrl { get; set; } = string.Empty;

        [Display(Name = "Link đích (Target URL)")]
        [Url(ErrorMessage = "Định dạng URL không hợp lệ")]
        public string? TargetUrl { get; set; }

        public bool IsActive { get; set; } = true; // Mặc định là true khi tạo mới

        public int DisplayOrder { get; set; } = 0; // Mặc định là 0

        // Thêm trường này để dễ quản lý dữ liệu
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
