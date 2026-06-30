using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // --- BỔ SUNG: Tính năng khuyến mãi đa dạng ---

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountAmount { get; set; } // Giảm theo số tiền (VD: 50.000)

        [Range(0, 100)]
        public int? DiscountPercentage { get; set; } // Giảm theo % (VD: 10 cho 10%)

        [NotMapped] // Tính toán giá cuối cùng để hiển thị
        public decimal FinalPrice
        {
            get
            {
                if (DiscountPercentage.HasValue && DiscountPercentage > 0)
                    return Price * (1 - (DiscountPercentage.Value / 100m));

                if (DiscountAmount.HasValue && DiscountAmount > 0)
                    return Price - DiscountAmount.Value;

                return Price;
            }
        }

        [NotMapped]
        public bool IsOnSale => (DiscountPercentage.HasValue && DiscountPercentage > 0) ||
                                (DiscountAmount.HasValue && DiscountAmount > 0);
        // ---------------------------------------------

        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        public virtual CategoryProduct? CategoryProduct { get; set; }
    }
}